import { Routes, Route } from 'react-router-dom';
import HomePage from '../screens/Home/Home';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<HomePage />} />
    </Routes>
  );
};

export default PrivateRoutes;
