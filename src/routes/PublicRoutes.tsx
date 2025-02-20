import { Routes, Route } from 'react-router-dom';
import Login from '../screens/SignIn/SignIn';
import Register from '../screens/SignUp/SignUp';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default PublicRoutes;
