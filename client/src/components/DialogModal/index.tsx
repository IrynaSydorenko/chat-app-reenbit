import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './DialogModal.module.scss';
import { Chat } from 'types';
import ToastNotification from '../ToastNotification';
import axios from 'axios';

interface DialogModalProps {
  type: 'create' | 'edit' | 'delete';
  data?: Partial<Chat>;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const DialogModal = ({ type, data, onClose, onSubmit }: DialogModalProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarImage, setAvatarImage] = useState('');

  useEffect(() => {
    const fetchRandomAvatar = async () => {
      const api = 'https://api.multiavatar.com/4645646';
      try {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = Buffer.from(image.data);
        setAvatarImage(buffer.toString('base64'));
      } catch (error) {}
    };

    if (type === 'create') {
      fetchRandomAvatar();
    }
  }, [type]);

  useEffect(() => {
    if (type === 'edit' && data) {
      const [firstName, lastName] = data.title!.split(' ');
      setFirstName(firstName || '');
      setLastName(lastName || '');
    }
  }, [type, data]);

  const handleSubmit = () => {
    if (type === 'create') {
      onSubmit({ firstName, lastName, avatarImage });
    } else if (type === 'edit') {
      onSubmit({ _id: data?._id, firstName, lastName });
    } else if (type === 'delete') {
      onSubmit(data);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h3>
          {type === 'create' && 'Create New Chat'}
          {type === 'edit' && 'Edit Chat Name'}
          {type === 'delete' && 'Confirm Delete'}
        </h3>
        {type !== 'delete' && (
          <>
            <label htmlFor='firstNameInput'>First Name</label>
            <input
              id='firstNameInput'
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor='lastNameInput'>Last Name</label>
            <input
              id='lastNameInput'
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}
        <div className={styles.actions}>
          <button onClick={handleSubmit}>
            {type === 'create' && 'Add'}
            {type === 'edit' && 'Edit'}
            {type === 'delete' && 'Delete'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default DialogModal;
