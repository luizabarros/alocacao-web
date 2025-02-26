import axios from "axios";

const API_URL = "http://localhost:8080/rooms"; 

// 🔹 Buscar todas as salas
export const getRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return [];
  }
};

// 🔹 Criar uma nova sala
export const createRoom = async (roomName) => {
  try {
    const response = await axios.post(API_URL, { name: roomName });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return null;
  }
};

// 🔹 Atualizar uma sala existente (✅ ADICIONADO!)
export const updateRoom = async (roomId, roomName) => {
  try {
    const response = await axios.put(`${API_URL}/${roomId}`, { name: roomName });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return null;
  }
};

// 🔹 Deletar uma sala
export const deleteRoom = async (roomId) => {
  try {
    await axios.delete(`${API_URL}/${roomId}`);
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
  }
};
