import axios from "axios";

const API_URL = "http://localhost:8080/lectures";

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

export const getLectures = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

export const createLecture = async (lecture) => {
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
  
  try {
    const response = await axios.post(API_URL, formattedLecture, getAuthHeaders()); 
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};


export const updateLecture = async (lectureId, lecture) => {
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

  try {
    const response = await axios.put<Lecture>(`${API_URL}/${lectureId}`, formattedLecture, getAuthHeaders()); 
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao atualizar aula.");
  }
};

export const deleteLecture = async (lectureId) => {
  try {
    await axios.delete(`${API_URL}/${lectureId}`, getAuthHeaders());
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao excluir aula.");
  }
};

export const getDayOfWeek = async () => {
  try {
    const response = await axios.get(`${API_URL}/dayOfWeek`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};