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
  Stack
} from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';

const Room = () => {
    const [room, setRoom] = useState([]);
    const [className, setClassName] = useState("");  
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const handleAddOrEdit = () => {
      if (className) {  
        if (editingIndex !== null) {
          const updatedRoom = [...room];
          updatedRoom[editingIndex] = { className };  
          setRoom(updatedRoom);
          toast.success("Turma editada com sucesso!");
        } else {
          setRoom([...room, { className }]);  
          toast.success("Turma adicionada com sucesso!");
        }
        setClassName("");  
        setOpenModal(false);
        setEditingIndex(null);
      } else {
        toast.error("Por favor, preencha o nome da turma!");
      }
    };

    const handleEdit = (index) => {
      setClassName(room[index].className); 
      setEditingIndex(index);
    };

    const handleDelete = (index) => {
      setDeleteIndex(index);
      setOpenDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
      const updatedRoom = room.filter((_, i) => i !== deleteIndex);
      setRoom(updatedRoom);
      setOpenDeleteModal(false);
      setDeleteIndex(null);
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
            value={className}  
            onChange={(e) => setClassName(e.target.value)} 
            fullWidth
          />

          <Button 
            onClick={() => setOpenModal(true)} 
            variant="contained" 
            fullWidth
            disabled={!className}  
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
              Deseja {editingIndex !== null ? "editar" : "cadastrar"} a turma?
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

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome da Turma</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {room.map((roomItem, index) => (
                <TableRow key={index}>
                  <TableCell>{roomItem.className}</TableCell>  
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

export default Room;
