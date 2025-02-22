import { Routes, Route } from 'react-router-dom';
import HomePage from '../screens/Home/Home';
import React from 'react';
import RoomManagement from '../screens/Home/RoomManagement/RoomManagement';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/room-management" element={<RoomManagement />} />
    </Routes>
  );
};

export default PrivateRoutes;
