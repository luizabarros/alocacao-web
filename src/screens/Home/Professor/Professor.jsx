import React, { useState, useEffect } from "react";
import {
  Container,
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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { listProfessors, updateProfessor, deleteProfessor } from "../../../services/professorService";

const Professor = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("all"); 

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (editingTeacher) {
      setTeacherName(editingTeacher.name);
      setIsAdmin(editingTeacher.isAdmin);
    }
  }, [editingTeacher]);

  useEffect(() => {
    filterTeachers();
  }, [filterName, filterAdmin, teachers]);

  const fetchTeachers = async () => {
    try {
      const data = await listProfessors();
      setTeachers(data);
    } catch (error) {
      toast.error("Erro ao carregar professores.");
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (filterName) {
      filtered = filtered.filter((teacher) =>
        teacher.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterAdmin === "all") {
      filtered = filtered;
    } else if (filterAdmin === "true") {
      filtered = filtered.filter((teacher) => teacher.isAdmin === true);
    } else if (filterAdmin === "false") {
      filtered = filtered.filter((teacher) => teacher.isAdmin === false);
    }

    setFilteredTeachers(filtered);
  };

  const handleOpenModal = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherName(teacher.name);
    setIsAdmin(teacher.isAdmin);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setTeacherName("");
    setIsAdmin(false);
    setEditingTeacher(null);
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    if (!teacherName.trim()) {
      toast.error("O nome do professor não pode estar vazio!");
      return;
    }

    try {
      await updateProfessor(editingTeacher.id, { name: teacherName, isAdmin, email: editingTeacher.email });
      toast.success("Professor atualizado com sucesso!");
      fetchTeachers();
      handleCloseModal();
    } catch (error) {
      toast.error("Erro ao atualizar professor.");
    }
  };

  const handleDelete = (teacher) => {
    setDeleteTeacherId(teacher.id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTeacherId) {
      toast.error("Erro: ID do professor não encontrado.");
      return;
    }

    try {
      await deleteProfessor(deleteTeacherId);
      toast.success("Professor deletado com sucesso!");
      fetchTeachers();
    } catch (error) {
      toast.error("Erro ao deletar professor.");
    }

    setOpenDeleteModal(false);
    setDeleteTeacherId(null);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Gerenciar Professores
      </Typography>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Filtrar por nome"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          fullWidth
          sx={{ my: 2 }}
        />
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Filtrar por Admin</InputLabel>
          <Select
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
            label="Filtrar por Admin"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="true">Administradores</MenuItem>
            <MenuItem value="false">Não Administradores</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#548dbd", padding: 4, borderRadius: 2, boxShadow: 24, color: "#fff" 
          }}
        >
          <Typography variant="h6">Editar Professor</Typography>

          <TextField
            label="Nome do Professor"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            fullWidth
            sx={{ my: 2 }}
          />

          <TextField
            label="E-mail"
            value={editingTeacher?.email || ""}
            fullWidth
            sx={{ my: 2 }}
            disabled
          />

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Checkbox
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <Typography>Administrador</Typography>
          </Box>

          <Button variant="contained" onClick={handleUpdate} sx={{ mr: 2, mt: 2 }}>
            Salvar Alterações
          </Button>

          <Button variant="outlined" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#212121", padding: 4, borderRadius: 2, boxShadow: 24, color: "#fff" 
          }}
        >
          <Typography variant="h6">Tem certeza que deseja excluir este professor?</Typography>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ mr: 2, mt: 2 }}>
            Sim
          </Button>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ mt: 2 }}>
            Não
          </Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.isAdmin ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenModal(teacher)} sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(teacher)}>
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

export default Professor;
