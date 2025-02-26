import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/professor/public',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('@ALOCACAO:token') || null);
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });

      setToken(response.data.token);
      setIsAdmin(response.data.isAdmin);

      localStorage.setItem('@ALOCACAO:token', response.data.token);
      
    } catch (error) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
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
      await api.post('/register', { email, password, name });
    } catch (error) {
      console.error('Erro ao realizar cadastro:', error.response?.data || error.message);
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
