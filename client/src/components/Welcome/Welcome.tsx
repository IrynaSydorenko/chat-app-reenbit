import React from 'react';
import styles from './Welcome.module.scss';

const Welcome: React.FC = () => {
  return (
    <div className={styles.welcome}>
      <h2>Select a chat to start messaging</h2>
    </div>
  );
};

export default Welcome;
