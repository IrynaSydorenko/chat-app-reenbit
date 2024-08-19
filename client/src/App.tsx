import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetAvatar from './components/SetAvatar';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/setAvatar'
          element={
            <ProtectedRoute>
              <SetAvatar />
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
