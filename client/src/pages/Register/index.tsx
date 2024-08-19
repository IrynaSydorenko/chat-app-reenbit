import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ToastNotification from '../../components/ToastNotification';
import { registerRoute } from '../../utils/APIRoutes';
import styles from './Register.module.scss';
import { setAuthToken, storeUserData } from '../../utils/auth';
import axiosInstance from '../../utils/axiosInstance';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.LOCALHOST_KEY ?? '')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = (): boolean => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error('Password and confirm password should be the same.');
      return false;
    } else if (username.length < 3) {
      toast.error('Username should be greater than 3 characters.');
      return false;
    } else if (password.length < 8) {
      toast.error('Password should be equal or greater than 8 characters.');
      return false;
    } else if (!email) {
      toast.error('Email is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      try {
        const { data } = await axiosInstance.post(registerRoute, {
          username,
          email,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg);
        } else if (data.status === true) {
          storeUserData(data.user);
          setAuthToken(data.token);
          navigate('/');
        }
      } catch (error) {
        toast.error(
          'An error occurred during registration. Please try again later.'
        );
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
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={handleChange}
          />
          <button type='submit'>Create User</button>
          <span>
            Already have an account? <Link to='/login'>Login.</Link>
          </span>
        </form>
      </div>
      <ToastNotification />
    </>
  );
};

export default Register;
