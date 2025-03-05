import React from "react";  
import { Routes, Route, Navigate } from "react-router-dom"; 
import HomePage from "../screens/Home/Home";
import RoomManagement from "../screens/Home/RoomManagement/RoomManagement";
import ProtectedRoute from "./ProtectedRoute";

  const PrivateRoutes = () => {
    return (
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/room-management" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  };

  export default PrivateRoutes;

