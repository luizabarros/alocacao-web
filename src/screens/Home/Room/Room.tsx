import React, { createContext, useContext, useState, ReactNode } from "react";
import { useEffect } from "react";
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
import { getRooms, createRoom, updateRoom, deleteRoom, Room } from "../../../services/roomService";

const RoomComponent: React.FC = () => {
  const [room, setRoom] = useState<Room[]>([]);
  const [className, setClassName] = useState<string>("");  
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    getRooms()
      .then(setRoom)
      .catch(() => toast.error("Erro ao carregar salas"));
  }, []);

  const handleAddOrEdit = async () => {
    if (!className) {
      toast.error("Por favor, preencha o nome da turma!");
      return;
    }
  
    try {
      if (editingIndex !== null) {
        const id = room[editingIndex].id;
        const updatedRoom = await updateRoom(id, className);
  
        if (updatedRoom) {
          const updatedRooms = [...room];
          updatedRooms[editingIndex] = updatedRoom;
          setRoom(updatedRooms);
          toast.success("Turma editada com sucesso!");
        }
      } else {
        const newRoom = await createRoom(className);
        if (newRoom) {
          setRoom([...room, newRoom]);
          toast.success("Turma adicionada com sucesso!");
        }
      }
  
      setClassName("");
      setOpenModal(false);
      setEditingIndex(null);
  
    } catch (error) {
      toast.error("Erro ao salvar turma!");
    }
  };
  
  const handleEdit = (index: number) => {
    setClassName(room[index].name); 
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return;
  
    try {
      const id = room[deleteIndex].id;
      await deleteRoom(id);
  
      setRoom(room.filter((_, i) => i !== deleteIndex));
      toast.success("Turma deletada com sucesso!");
  
    } catch (error) {
      toast.error("Erro ao deletar turma!");
    }
  
    setOpenDeleteModal(false);
    setDeleteIndex(null);
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

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">
            Deseja {editingIndex !== null ? "editar" : "cadastrar"} a turma?
          </Typography>
          <Button variant="contained" onClick={handleAddOrEdit} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ mt: 2 }}>Não</Button>
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
              <TableRow key={roomItem.id}>
                <TableCell>{roomItem.name}</TableCell>  
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(index)} sx={{ mr: 2 }}>Editar</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(index)}>Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RoomComponent;
