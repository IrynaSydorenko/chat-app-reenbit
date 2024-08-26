import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi';
import { logoutRoute } from '../../utils/APIRoutes';
import styles from './Logout.module.scss';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { clearLocalStorage } from '../../utils/auth';

const Logout = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const { status } = await axiosInstance.post(`${logoutRoute}`);
    if (status === 200) {
      toast.success('Logged out successfully');
      clearLocalStorage();
      navigate('/login');
    }
  };

  return (
    <>
      <button className={styles.button} onClick={handleClick}>
        <span>Log Out</span> <BiPowerOff />
      </button>
    </>
  );
};

export default Logout;
