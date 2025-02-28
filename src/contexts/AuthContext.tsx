import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface AuthContextType {
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (email: string, password: string, name: string) => Promise<void>; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("@ALOCACAO:token") || null
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
        console.error("⚠️ Email ou senha vazios.");
        return;
    }

    console.log("🔍 Tentando login com:", { email, password });

    try {
        const response = await api.post(
            "/professor/public/login",
            {
                email: email.trim(), 
                password: password.trim(),
            },
            {
                headers: { "Content-Type": "application/json" }, 
            }
        );

        console.log("✅ Login bem-sucedido:", response.data);

        const authToken = response.data.token;
        const userIsAdmin = response.data.isAdmin;

        if (!authToken) {
            console.error("❌ Token JWT não retornado pelo backend.");
            return;
        }

        // Definir o token no estado global/contexto
        setToken(authToken);
        setIsAdmin(userIsAdmin);

        // Armazenar no localStorage para manter a sessão
        localStorage.setItem("@ALOCACAO:token", authToken);
        localStorage.setItem("@ALOCACAO:isAdmin", JSON.stringify(userIsAdmin));

        // Definir o token nos headers do Axios para futuras requisições
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        navigate("/dashboard"); // Redireciona para o dashboard
    } catch (error: any) {
        console.error("❌ Erro ao fazer login:", error.response?.data || error.message);

        if (error.response) {
            console.error("📡 Resposta do servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("🌐 Sem resposta do servidor, verifique a conexão.");
        }

        throw error;
    }
};


  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("@ALOCACAO:token");
    localStorage.removeItem("@ALOCACAO:isAdmin");
    navigate("/");
  };

  const registerUser = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
        console.error("⚠️ Campos obrigatórios faltando.");
        return;
    }

    console.log("🔍 Tentando registrar usuário com:", { email, password, name });

    try {
        const response = await api.post(
            "/professor/public/register", // 🔄 URL corrigida
            {
                email: email.trim(),
                password: password.trim(),
                name: name.trim(),
            },
            {
                headers: { 
                    "Content-Type": "application/json",
                }, // Removendo Authorization para evitar bloqueio
            }
        );

        console.log("✅ Cadastro realizado com sucesso!", response.data);
    } catch (error: any) {
        console.error("❌ Erro ao realizar o cadastro:", error.response?.data || error.message);

        if (error.response?.status === 403) {
            console.error("⛔️ Erro 403: O servidor está bloqueando a requisição. Verifique as permissões no backend.");
        } else if (error.response) {
            console.error("📡 Resposta do servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("🌐 Sem resposta do servidor, verifique sua conexão.");
        }

        throw error;
    }
};


return (
    <AuthContext.Provider value={{ token, isAdmin, login: handleLogin, logout: handleLogout, registerUser }}>
        {children}
    </AuthContext.Provider>
);


};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
