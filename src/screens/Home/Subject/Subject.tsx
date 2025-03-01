import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { listSubjects, createSubject, updateSubject, deleteSubject, updateSubjectProfessor } from "../../../services/subjectService";
import { getProfessors } from "../../../services/professorService";


interface SubjectItem {
  id: string;
  name: string;
  codClass: string;
  professorId?: string | null;
  professorName?: string;
}

export interface Professor {
  id: string;
  name: string;
}


const Subject: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [name, setName] = useState<string>("");
  const [codClass, setCodClass] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const professorList = await getProfessors(); 
      setProfessors(professorList); 
  
      const data = await listSubjects();
  
      const formattedData: SubjectItem[] = data.map((subject: any) => ({
        id: subject.id,
        name: subject.name,
        codClass: subject.codClass,
        professorId: subject.professorId || null,
        professorName: subject.professorId
          ? professorList.find((p) => p.id === subject.professorId)?.name || "Sem Professor"
          : "Sem Professor",
      }));
  
      setSubjects(formattedData);
    } catch (error) {
      toast.error("Erro ao carregar disciplinas.");
    }
  };
  

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const data = await getProfessors();
        console.log("Professores carregados:", data); // ✅ Debug para ver se os dados chegam
        setProfessors(data);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
      }
    };
  
    fetchProfessors();
  }, []);

  const handleAddOrEdit = async () => {
    if (!name || !codClass) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const subjectData = { name, codClass, professorId: professorId || null };
      if (editingSubject) {
        await updateSubject(editingSubject.id, subjectData);
        toast.success("Disciplina editada com sucesso!");
      } else {
        await createSubject(subjectData);
        toast.success("Disciplina adicionada com sucesso!");
      }

      setOpenModal(false);
      resetFields();
      fetchSubjects();
    } catch (error) {
      toast.error("Erro ao salvar disciplina.");
    }
  };

  const handleEdit = (subject: SubjectItem): void => {
    setEditingSubject(subject);
    setName(subject.name);
    setCodClass(subject.codClass);
    setProfessorId(subject.professorId || null);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (deleteSubjectId) {
      try {
        await deleteSubject(deleteSubjectId);
        toast.success("Disciplina deletada com sucesso!");
        fetchSubjects();
      } catch (error) {
        toast.error("Erro ao deletar disciplina.");
      }
      setOpenDeleteModal(false);
      setDeleteSubjectId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteSubjectId) {
      try {
        await deleteSubject(deleteSubjectId);
        toast.success("Disciplina deletada com sucesso!");
        fetchSubjects();
      } catch (error) {
        toast.error("Erro ao deletar disciplina.");
      }
      setOpenDeleteModal(false);
      resetFields();
    }
  };

  const handleDeleteCancel = (): void => {
    setOpenDeleteModal(false);
    resetFields();
  };

  const handleAssignProfessor = async (subjectId: string, professorId: string) => {
    if (!subjectId || !professorId) {
      toast.error("Selecione uma disciplina e um professor.");
      return;
    }

    const updatedSubject = await updateSubjectProfessor(subjectId, professorId);
    if (updatedSubject) {
      toast.success("Professor atualizado com sucesso!");
      fetchSubjects(); 
    } else {
      toast.error("Erro ao atualizar professor.");
    }
  };

  const resetFields = () => {
    setName("");
    setCodClass("");
    setEditingSubject(null);
    setDeleteSubjectId(null);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Gerenciar Disciplinas
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

        <FormControl fullWidth>
          <InputLabel>Código da Turma</InputLabel>
          <Select value={codClass} onChange={(e) => setCodClass(e.target.value)} label="Código da Turma">
            <MenuItem value="T1">T1</MenuItem>
            <MenuItem value="T2">T2</MenuItem>
            <MenuItem value="T3">T3</MenuItem>
            <MenuItem value="T4">T4</MenuItem>
            <MenuItem value="T5">T5</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Professor (Opcional)</InputLabel>
          <Select value={professorId || ""} onChange={(e) => setProfessorId(e.target.value)}>
            <MenuItem value="">Nenhum</MenuItem> 
            {professors.length > 0 ? (
              professors.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>{prof.name}</MenuItem>
              ))
            ) : (
              <MenuItem disabled>Carregando...</MenuItem> 
            )}
          </Select>
        </FormControl>

        <Button onClick={() => setOpenModal(true)} variant="contained" fullWidth disabled={!name || !codClass}>
          {editingSubject ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">
            {editingSubject ? "Editar Disciplina" : "Cadastrar Disciplina"}
          </Typography>

          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ my: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel>Código da Turma</InputLabel>
            <Select value={codClass} onChange={(e) => setCodClass(e.target.value)} label="Código da Turma">
              <MenuItem value="T1">T1</MenuItem>
              <MenuItem value="T2">T2</MenuItem>
              <MenuItem value="T3">T3</MenuItem>
              <MenuItem value="T4">T4</MenuItem>
              <MenuItem value="T5">T5</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Professor (Opcional)</InputLabel>
            <Select value={professorId || ""} onChange={(e) => setProfessorId(e.target.value)}>
              <MenuItem value="">Nenhum</MenuItem>
              {professors.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>{prof.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleAddOrEdit} sx={{ mr: 2, mt: 2 }}>
            {editingSubject ? "Salvar Alterações" : "Criar"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              resetFields();
              setOpenModal(false);
            }}
            sx={{ mt: 2 }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={handleDeleteCancel}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">
            Tem certeza que deseja deletar esta disciplina?
          </Typography>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={handleDeleteCancel} sx={{ mt: 2 }}>Não</Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.codClass}</TableCell>
                <TableCell>{subject.professorName || "Não atribuído"}</TableCell> 
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(subject)} sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => {
                    setDeleteSubjectId(subject.id);
                    setOpenDeleteModal(true);
                  }}>
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Subject;