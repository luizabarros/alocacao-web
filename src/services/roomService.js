import axios from "axios";

const API_URL = "http://localhost:8080/rooms"; 

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



export const getRooms = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (roomName) => {
  try {
    const response = await axios.post(API_URL, { name: roomName }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (roomId, roomName) => {
  try {
    const response = await axios.put(`${API_URL}/${roomId}`, { name: roomName }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    await axios.delete(`${API_URL}/${roomId}`, getAuthHeaders());
  } catch (error) {
    throw error;
  }
};




