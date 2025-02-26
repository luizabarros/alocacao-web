import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../screens/SignIn/SignIn';
import Register from '../screens/SignUp/SignUp';
import React from 'react';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} /> {/* 🔥 Corrigido */}
    </Routes>
  );
};

export default PublicRoutes;
