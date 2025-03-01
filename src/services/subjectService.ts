import axios from 'axios';

const API_URL = 'http://localhost:8080/disciplinas'; 

export interface Subject {
    id: string;
    name: string;
    codClass: string;
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
  
  export const listSubjects = async (): Promise<Subject[]> => {
    try {
      const response = await axios.get<Subject[]>(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      return [];
    }
  };
  
  export const createSubject = async (subjectData: { name: string; codClass: string }): Promise<Subject | null> => {
    try {
      const response = await axios.post<Subject>(API_URL, subjectData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erro ao criar disciplina:", error);
      return null;
    }
  };
  
  export const updateSubject = async (subjectId: string, subjectData: { name: string; codClass: string }): Promise<Subject | null> => {
    try {
      const response = await axios.put<Subject>(`${API_URL}/${subjectId}`, subjectData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar disciplina:", error);
      return null;
    }
  };
  
  export const deleteSubject = async (subjectId: string): Promise<void> => {
    try {
      console.log("🗑️ Deletando disciplina com ID:", subjectId); // Debug
      console.log("🔑 Enviando token:", localStorage.getItem("@ALOCACAO:token")); // Debug
  
      await axios.delete(`${API_URL}/${subjectId}`, getAuthHeaders());
      console.log("✅ Disciplina deletada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao deletar disciplina:", error);
    }
  };
  
  export const getSubjectById = async (subjectId: string): Promise<Subject | null> => {
    try {
      const response = await axios.get<Subject>(`${API_URL}/${subjectId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar disciplina:", error);
      return null;
    }
  };
  
  export const updateSubjectProfessor = async (subjectId: string, professorId: string): Promise<Subject | null> => {
    try {
      const response = await axios.put<Subject>(`${API_URL}/${subjectId}/professor/${professorId}`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erro ao associar professor à disciplina:", error);
      return null;
    }
  };

