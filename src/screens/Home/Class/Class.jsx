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
  Typography,
  Stack,
  Modal,
  Box
} from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';

const Class = () => {
  const [classGroup, setClassGroup] = useState([]);
  const [name, setName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAdd = () => {
    if (name) {
      setOpenModal(true);
    } else {
      toast.error("Por favor, preencha o nome da turma!");
    }
  };

  const handleModalClose = (shouldAdd) => {
    if (shouldAdd) {
      if (editingIndex !== null) {
        const updatedClassGroup = [...classGroup];
        updatedClassGroup[editingIndex].name = name;
        setClassGroup(updatedClassGroup);
      } else {
        setClassGroup([...classGroup, { name }]);
      }
      setName("");
    }
    setOpenModal(false);
    setEditingIndex(null);o
  };

  const handleEdit = (index) => {
    setName(classGroup[index].name);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedClassGroup = classGroup.filter((_, i) => i !== deleteIndex);
    setClassGroup(updatedClassGroup);
    setOpenDeleteModal(false);
    toast.success("Turma deletada com sucesso!");
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Gerenciar Turmas
      </Typography>
      
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        <TextField 
          label="Nome da Turma" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth
        />
        
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          fullWidth
          disabled={!name}
        >
          {editingIndex !== null ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classGroup.map((classGroupItem, index) => (
              <TableRow key={index}>
                <TableCell>{classGroupItem.name}</TableCell>
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

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">Deseja {editingIndex !== null ? "editar" : "cadastrar"} a turma?</Typography>
          <Button
            variant="contained"
            onClick={() => handleModalClose(true)}
            sx={{ mr: 2, mt: 2 }}
          >
            Sim
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleModalClose(false)}
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
          <Typography variant="h6">Deseja realmente deletar esta turma?</Typography>
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
    </Container>
  );
};

export default Class;
