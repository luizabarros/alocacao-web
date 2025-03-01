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
    if (!lecture.subjectId || !lecture.roomId) {
      console.error("⚠️ subjectId e roomId são obrigatórios para criar uma aula!");
      return null;
    }
  
    if (!lecture.hourInit || !lecture.duration || !lecture.dayOfWeek) {
      console.error("⚠️ Campos obrigatórios (hourInit, duration, dayOfWeek) estão ausentes!");
      return null;
    }
  
    const formattedLecture = {
      subjectId: lecture.subjectId,
      roomId: lecture.roomId,
      dayOfWeek: lecture.dayOfWeek.toUpperCase(),
      hourInit: lecture.hourInit.split(":").length === 2 ? `${lecture.hourInit}:00` : lecture.hourInit,
      duration: lecture.duration.startsWith("PT") ? lecture.duration : `PT${lecture.duration}M`
    };
  
    console.log("📤 Enviando para API:", JSON.stringify(formattedLecture, null, 2));
  
    try {
      const response = await axios.post<Lecture>(API_URL, formattedLecture, getAuthHeaders());
      console.log("✅ Aula criada com sucesso!", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar aula:", error.response?.data || error.message);
  
      const errorMessage = error.response?.data?.message || error.response?.data || "Erro desconhecido ao criar aula.";
  
      throw new Error(errorMessage); 
    }
  };
  


export const updateLecture = async (lectureId: string, lecture: Lecture): Promise<Lecture | null> => {
  if (!lecture.subjectId || !lecture.roomId) {
    console.error("⚠️ subjectId e roomId são obrigatórios para atualizar a aula!");
    return null;
  }

  if (!lecture.hourInit || !lecture.duration || !lecture.dayOfWeek) {
    console.error("⚠️ Campos obrigatórios (hourInit, duration, dayOfWeek) estão ausentes!");
    return null;
  }

  const formattedLecture = {
    subjectId: lecture.subjectId,
    roomId: lecture.roomId,
    dayOfWeek: lecture.dayOfWeek.toUpperCase(), 
    hourInit: lecture.hourInit.length === 5 ? `${lecture.hourInit}:00` : lecture.hourInit, 
    duration: `PT${lecture.duration}M` 
  };
  

  try {
    const response = await axios.put<Lecture>(`${API_URL}/${lectureId}`, formattedLecture, getAuthHeaders());
    console.log("✅ Aula atualizada com sucesso!", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar aula:", error);
    return null;
  }
};

export const deleteLecture = async (lectureId: string): Promise<void> => {
  try {
    console.log("🗑️ Deletando aula com ID:", lectureId);
    await axios.delete(`${API_URL}/${lectureId}`, getAuthHeaders());
    console.log("✅ Aula deletada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao deletar aula:", error);
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