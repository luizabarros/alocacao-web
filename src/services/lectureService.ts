import axios from "axios";

const API_URL = "http://localhost:8080/lectures";

export interface Lecture {
  id?: string;
  subjectId: string;
  roomId: string;
  dayOfWeek: string;
  hourInit: string;
  duration: string;
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

export const getLectures = async (): Promise<Lecture[]> => {
  try {
    const response = await axios.get<Lecture[]>(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar aulas:", error);
    return [];
  }
};

export const createLecture = async (lecture: Lecture): Promise<Lecture | null> => {
  if (!lecture.subjectId || !lecture.roomId || !lecture.dayOfWeek) {
    console.error("⚠️ subjectId, roomId e dayOfWeek são obrigatórios para criar uma aula!");
    return null;
  }

  const formattedLecture = {
    subjectId: lecture.subjectId,
    roomId: lecture.roomId,
    dayOfWeek: lecture.dayOfWeek.toUpperCase(), 
    hourInit: lecture.hourInit.includes(":") ? lecture.hourInit : `${lecture.hourInit}:00`, 
    duration: lecture.duration.startsWith("PT") ? lecture.duration : `PT${lecture.duration}M` 
  };

  console.log("📤 Enviando criação para API:", JSON.stringify(formattedLecture, null, 2));

  try {
    const response = await axios.post<Lecture>(API_URL, formattedLecture, getAuthHeaders()); 
    console.log("✅ Aula criada com sucesso!", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao criar aula:", error.response?.data || error.message);
    return null;
  }
};


export const updateLecture = async (lectureId: string, lecture: Lecture): Promise<Lecture | null> => {
  if (!lecture.subjectId || !lecture.roomId || !lecture.dayOfWeek) {
    console.error("⚠️ subjectId, roomId e dayOfWeek são obrigatórios para atualizar a aula!");
    return null;
  }

  const formattedLecture = {
    subjectId: lecture.subjectId,
    roomId: lecture.roomId,
    dayOfWeek: lecture.dayOfWeek.toUpperCase(),  
    hourInit: lecture.hourInit.includes(":") ? lecture.hourInit : `${lecture.hourInit}:00`, 
    duration: lecture.duration.startsWith("PT") ? lecture.duration : `PT${lecture.duration}M`
  };

  console.log("📤 Enviando atualização para API:", JSON.stringify(formattedLecture, null, 2));

  try {
    const response = await axios.put<Lecture>(`${API_URL}/${lectureId}`, formattedLecture, getAuthHeaders()); 
    console.log("✅ Aula atualizada com sucesso!", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao atualizar aula:", error.response?.data || error.message);
    return null;
  }
};

export const deleteLecture = async (lectureId: string): Promise<void> => {
  try {
    console.log("📡 Enviando requisição DELETE para excluir aula com ID:", lectureId);
    await axios.delete(`${API_URL}/${lectureId}`, getAuthHeaders());
    console.log("✅ Aula deletada com sucesso! (Confirmação da API)");
  } catch (error: any) {
    console.error("❌ Erro ao deletar aula:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao excluir aula.");
  }
};

export const getDayOfWeek = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_URL}/dayOfWeek`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar dias da semana:", error);
    return [];
  }
};