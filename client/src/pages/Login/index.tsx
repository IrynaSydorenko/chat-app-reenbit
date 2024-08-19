import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginRoute } from '../../utils/APIRoutes';
import ToastNotification from '../../components/ToastNotification';
import styles from './Login.module.scss';
import { setAuthToken, storeUserData } from '../../utils/auth';
import axiosInstance from '../../utils/axiosInstance';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', password: '' });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY ?? '')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = (): boolean => {
    const { username, password } = values;
    if (username === '' || password === '') {
      toast.error('Username and Password are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      try {
        const { data } = await axiosInstance.post(loginRoute, {
          username,
          password,
        });
        if (!data.status) {
          toast.error(data.msg);
        } else {
          storeUserData(data.user);
          setAuthToken(data.token);
          navigate('/');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.brand}>
            <h1>Chat App</h1>
          </div>
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={handleChange}
            min='3'
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={handleChange}
          />
          <button type='submit'>Log In</button>
          <span>
            Don't have an account? <Link to='/register'>Create One.</Link>
          </span>
        </form>
      </div>
      <ToastNotification />
    </>
  );
};

export default Login;
