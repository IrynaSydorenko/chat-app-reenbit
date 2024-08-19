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
  localStorage.setItem(process.env.LOCALHOST_KEY ?? '', JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  return JSON.parse(
    localStorage.getItem(process.env.LOCALHOST_KEY ?? '') || ''
  );
};
