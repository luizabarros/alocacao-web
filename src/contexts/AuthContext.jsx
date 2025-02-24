import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('@ALOCACAO:token') || null);
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
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
      setIsAdmin(data.isAdmin);

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

  const registerUser = async (email, password, name) => {
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
    <AuthContext.Provider value={{ token, login, logout, registerUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
