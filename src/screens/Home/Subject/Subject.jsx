import React, { useState } from "react";
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
import { toast, ToastContainer } from 'react-toastify';
import { set } from "react-hook-form";

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [cod, setCod] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAddOrEdit = () => {
    if (name && cod) {
      if (editingIndex !== null) {
        const updatedSubjects = [...subjects];
        updatedSubjects[editingIndex] = { name, cod }; 
        setSubjects(updatedSubjects);
        toast.success("Disciplina editada com sucesso!");
      } else {
        setSubjects([...subjects, { name, cod }]); 
        toast.success("Disciplina adicionada com sucesso!");
      }
      setName("");
      setCod("");
      setOpenModal(false);
      setEditingIndex(null);
    } else {
      toast.error("Por favor, preencha todos os campos!");
    }
  };

  const handleEdit = (index) => {
    setName(subjects[index].name);
    setCod(subjects[index].cod);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedSubjects = subjects.filter((_, i) => i !== deleteIndex);
    setSubjects(updatedSubjects);
    setOpenDeleteModal(false);
    setDeleteIndex(null);
    toast.success("Disciplina deletada com sucesso!");
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <Container>
      <ToastContainer />  
      <Typography variant="h4" gutterBottom>
        Gerenciar Disciplinas
      </Typography>

      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        <TextField 
          label="Nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>Código da Turma</InputLabel>
          <Select
            value={cod}
            onChange={(e) => setCod(e.target.value)}
            label="Código da Turma"
          >
            <MenuItem value="A001">A001</MenuItem>
            <MenuItem value="B002">B002</MenuItem>
            <MenuItem value="C003">C003</MenuItem>
          </Select>
        </FormControl>

        <Button 
          onClick={() => setOpenModal(true)} 
          variant="contained" 
          fullWidth
          disabled={!name || !cod}
        >
          {editingIndex !== null ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">
            Deseja {editingIndex !== null ? "editar" : "cadastrar"} a disciplina?
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddOrEdit} 
            sx={{ mr: 2, mt: 2 }}
          >
            Sim
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenModal(false)}
            sx={{ mt: 2 }}
          >
            Não
          </Button>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={handleDeleteCancel}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">Deseja realmente deletar esta disciplina?</Typography>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{ mr: 2, mt: 2 }}
          >
            Sim
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteCancel}
            sx={{ mt: 2 }}
          >
            Não
          </Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.cod}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleEdit(index)} 
                    sx={{ mr: 2 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(index)}
                  >
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
