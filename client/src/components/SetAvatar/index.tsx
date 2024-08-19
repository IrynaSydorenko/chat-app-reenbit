import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import loader from '../../assets/loader.gif';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setAvatarRoute } from '../../utils/APIRoutes';
import styles from './SetAvatar.module.scss';
import ToastNotification from '../ToastNotification';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';

const SetAvatar: React.FC = () => {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>();

  useEffect(() => {
    if (!localStorage.getItem(process.env.LOCALHOST_KEY ?? '')) {
      navigate('/login');
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar');
    } else {
      const user = JSON.parse(
        localStorage.getItem(process.env.LOCALHOST_KEY ?? '') || '{}'
      );

      try {
        const { data } = await axiosInstance.post(
          `${setAvatarRoute}/${user._id}`,
          {
            image: avatars[selectedAvatar],
          }
        );

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem(
            process.env.LOCALHOST_KEY ?? '',
            JSON.stringify(user)
          );
          navigate('/');
        } else {
          toast.error('Error setting avatar. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data: string[] = [];
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString('base64'));
        } catch (error) {
          toast.error('Failed to load avatars. Please refresh the page.');
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, [api]);

  return (
    <>
      {isLoading ? (
        <div className={styles.container}>
          <img src={loader} alt='loader' className={styles.loader} />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className={styles.avatars}>
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`${styles.avatar} ${
                  selectedAvatar === index ? styles.selected : ''
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt='avatar' />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className={styles.submitBtn}>
            Set as Profile Picture
          </button>
        </div>
      )}
      <ToastNotification />
    </>
  );
};

export default SetAvatar;
