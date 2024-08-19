import React from 'react';
import { ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastNotificationProps {
  options?: ToastOptions;
}

const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

const ToastNotification: React.FC<ToastNotificationProps> = ({ options }) => {
  const mergedOptions = { ...defaultToastOptions, ...options };

  return <ToastContainer {...mergedOptions} />;
};

export default ToastNotification;
