import { User } from 'types';

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const storeUserData = (user: User) => {
  localStorage.setItem(
    process.env.LOCALHOST_KEY || 'chat-app-user',
    JSON.stringify(user)
  );
};

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem(
    process.env.LOCALHOST_KEY || 'chat-app-user'
  );
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
      return null;
    }
  }
  return null;
};
