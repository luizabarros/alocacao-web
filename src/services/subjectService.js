import axios from "axios";
import { listProfessors } from "./professorService"; 

const API_URL = "http://localhost:8080/subjects"; 
const PROFESSOR_API_URL = "http://localhost:8080/professores/private/all"; 

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

export const getSubjects = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listSubjects = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    const subjects = response.data;

    const professors = await listProfessors();  

    return subjects.map(subject => ({
      ...subject,
      professorName: professors.find(prof => prof.id === subject.professorId)?.name || "Não atribuído" 
    }));
  } catch (error) {
    throw error;
  }
};


export const createSubject = async (subjectData) => {
  try {
    const response = await axios.post(API_URL, subjectData, getAuthHeaders());
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await axios.put(`${API_URL}/${subjectId}`, subjectData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubject = async (subjectId) => {
  try {  
    await axios.delete(`${API_URL}/${subjectId}`, getAuthHeaders());
  } catch (error) {
    throw error;
  }
};

export const getSubjectById = async (subjectId) => {
  try {
    const response = await axios.get<Subject>(`${API_URL}/${subjectId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubjectProfessor = async (subjectId, professorId) => {
  try {
    const response = await axios.put<Subject>(
      `${API_URL}/${subjectId}/professor/${professorId}`,  
      {},  
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao associar professor à disciplina:", error);
    return null;
  }
};


