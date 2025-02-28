import axios from "axios";

const API_URL = "http://localhost:8080/rooms"; 

export interface Room {
  id: number;
  name: string;
}

export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await axios.get<Room[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return [];
  }
};

export const createRoom = async (roomName: string): Promise<Room | null> => {
  try {
    const response = await axios.post<Room>(API_URL, { name: roomName });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return null;
  }
};

export const updateRoom = async (roomId: number, roomName: string): Promise<Room | null> => {
  try {
    const response = await axios.put<Room>(`${API_URL}/${roomId}`, { name: roomName });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return null;
  }
};

export const deleteRoom = async (roomId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${roomId}`);
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
  }
};


