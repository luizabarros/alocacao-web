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

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [codClass, setCodClass] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [professorId, setProfessorId] = useState(null);

  // Filtros
  const [filterName, setFilterName] = useState("");
  const [filterCodClass, setFilterCodClass] = useState("");
  const [filterProfessor, setFilterProfessor] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const professorList = await getProfessors();
      setProfessors(professorList);

      const data = await listSubjects();

      const formattedData = data.map((subject) => ({
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
        setProfessors(data);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
      }
    };

    fetchProfessors();
  }, []);

  // Filtro de disciplinas
  const filteredSubjects = subjects.filter((subject) => {
    return (
      (filterName ? subject.name.toLowerCase().includes(filterName.toLowerCase()) : true) &&
      (filterCodClass ? subject.codClass.toLowerCase().includes(filterCodClass.toLowerCase()) : true) &&
      (filterProfessor ? subject.professorName.toLowerCase().includes(filterProfessor.toLowerCase()) : true)
    );
  });

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

  const handleEdit = (subject) => {
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

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    resetFields();
  };

  const handleAssignProfessor = async (subjectId, professorId) => {
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

      {/* Filtros */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <TextField
          label="Filtrar por Nome"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Filtrar por Código"
          value={filterCodClass}
          onChange={(e) => setFilterCodClass(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel id="professor-label">Professor</InputLabel>
          <Select
            labelId="professor-label"
            id="professor-select"
            value={filterProfessor}
            onChange={(e) => setFilterProfessor(e.target.value)}
            label="Professor"
          >
            <MenuItem value="">Todos</MenuItem>
            {professors.map((prof) => (
              <MenuItem key={prof.id} value={prof.name}>{prof.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

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

        <FormControl fullWidth variant="outlined">
          <InputLabel id="professor-label">Professor (Opcional)</InputLabel>
          <Select
            labelId="professor-label"
            id="professor-select"
            value={professorId || ""}
            onChange={(e) => setProfessorId(e.target.value)}
            label="Professor (Opcional)"
          >
            <MenuItem value="">Nenhum</MenuItem>
            {professors.map((prof) => (
              <MenuItem key={prof.id} value={prof.id}>{prof.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={() => setOpenModal(true)} variant="contained" fullWidth disabled={!name || !codClass}>
          {editingSubject ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#548dbd", padding: 4, borderRadius: 2, boxShadow: 24, color: "#fff" 
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

          <FormControl fullWidth sx={{ mt: 2 }} variant="outlined">
            <InputLabel id="professor-label">Professor (Opcional)</InputLabel>
            <Select labelId="professor-label" id="professor-select" value={professorId || ""} onChange={(e) => setProfessorId(e.target.value)}>
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
          backgroundColor: "#212121", padding: 4, borderRadius: 2, boxShadow: 24, color: "#fff" 
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
            {filteredSubjects.map((subject) => (
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
