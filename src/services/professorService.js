import axios from "axios";

const API_URL = "http://localhost:8080/professor/private/all";

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

export const getProfessors = async () => {
  try {
    const professors = await listProfessors();  
    return professors;
  } catch (error) {
    throw error;
  }
};

export const listProfessors = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfessor = async (professorId) => {
  try {
    await axios.delete(`${API_URL}/${professorId}`, getAuthHeaders());
  } catch (error) {
    throw error;
  }
};

export const updateProfessor = async (professorId, data) => {
  try {
    const response = await axios.put(`${API_URL}/${professorId}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};
