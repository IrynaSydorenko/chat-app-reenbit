import React, { useState, useEffect } from 'react';
import Robot from '../../assets/robot.gif';
import styles from './Welcome.module.scss';

const Welcome: React.FC = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      const user = await JSON.parse(
        localStorage.getItem(process.env.LOCALHOST_KEY ?? '') || '{}'
      );
      setUserName(user.username);
    };

    loadUserName();
  }, []);

  return (
    <div className={styles.container}>
      <img src={Robot} alt='Welcome Robot' />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </div>
  );
};

export default Welcome;
