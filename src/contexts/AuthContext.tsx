import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IAuthContext {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('@ALOCACAO:token') || null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/professor/public/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('@ALOCACAO:token', data.token);
      
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('@ALOCACAO:token');
    navigate('/');
  };

  const registerUser = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('http://localhost:8080/professor/public/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao realizar cadastro');
      }

    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
