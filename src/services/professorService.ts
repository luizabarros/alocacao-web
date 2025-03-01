import axios from "axios";

const API_URL = "http://localhost:8080/professor/private/all";

export interface Professor {
  id: string;
  name: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("@ALOCACAO:token");
  const expiresAt = localStorage.getItem("@ALOCACAO:expiresAt");

  if (!token || !expiresAt) {
    console.error("🚨 Token não encontrado ou expirado!");
    return {};
  }

  if (Date.now() > Number(expiresAt)) {
    console.error("⏳ Token expirado! Faça login novamente.");
    localStorage.removeItem("@ALOCACAO:token");
    localStorage.removeItem("@ALOCACAO:expiresAt");
    return {};
  }

  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getProfessors = async (): Promise<Professor[]> => {
  try {
    const professors = await listProfessors();  
    return professors;
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    return [];
  }
};

export const listProfessors = async (): Promise<Professor[]> => {
  try {
    const response = await axios.get<Professor[]>(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    return [];
  }
};


