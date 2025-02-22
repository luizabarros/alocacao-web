import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';

const App = () => {
  const token = localStorage.getItem('@ALOCACAO:token');

  return (
    <Router>
      <AuthProvider>
        {token ? <PrivateRoutes /> : <PublicRoutes />}
      </AuthProvider>
    </Router>
  );
};

export default App;
