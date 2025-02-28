import React from "react"; 
import { Routes, Route, Navigate } from "react-router-dom"; 
import Login from "../screens/SignIn/SignIn";
import Register from "../screens/SignUp/SignUp";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PublicRoutes;

