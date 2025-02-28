import axios from "axios";

const API_URL = "http://localhost:8080/rooms"; 

export interface Room {
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



export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await axios.get<Room[]>(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return [];
  }
};

export const createRoom = async (roomName: string): Promise<Room | null> => {
  try {
    const response = await axios.post<Room>(API_URL, { name: roomName }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return null;
  }
};

export const updateRoom = async (roomId: string, roomName: string): Promise<Room | null> => {
  try {
    const response = await axios.put<Room>(`${API_URL}/${roomId}`, { name: roomName }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return null;
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    console.log("🗑️ Deletando sala com ID:", roomId); // Debug 
    console.log("🔑 Enviando token:", localStorage.getItem("@ALOCACAO:token")); // Debug 

    await axios.delete(`${API_URL}/${roomId}`, getAuthHeaders());
    console.log("✅ Sala deletada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao deletar sala:", error);
  }
};




