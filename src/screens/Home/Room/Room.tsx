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
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null); 

  useEffect(() => {
    getRooms()
      .then(setRoom)
      .catch(() => toast.error("Erro ao carregar salas"));
  }, []);

  const handleAddOrEdit = async () => {
    if (!className) {
      toast.error("Por favor, preencha o nome da sala!");
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
          toast.success("Sala editada com sucesso!");
        }
      } else {
        const newRoom = await createRoom(className);
        if (newRoom) {
          setRoom([...room, newRoom]);
          toast.success("Sala adicionada com sucesso!");
        }
      }
  
      setClassName("");
      setOpenModal(false);
      setEditingIndex(null);
  
    } catch (error) {
      toast.error("Erro ao salvar sala!");
    }
  };
  
  const handleEdit = (index: number) => {
    setClassName(room[index].name); 
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const id = room[index].id;
    console.log("🗑️ Tentando deletar sala com ID:", id); // 🔍 Debug
    setDeleteRoomId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRoomId) {
      console.error("⚠️ Nenhum ID de sala selecionado para exclusão.");
      return;
    }

    try {
      console.log("🚀 Enviando DELETE para sala com ID:", deleteRoomId); // 🔍 Debug
      await deleteRoom(deleteRoomId);
  
      setRoom((prevRooms) => prevRooms.filter((room) => room.id !== deleteRoomId));

      toast.success("Sala deletada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao deletar sala:", error);
      toast.error("Erro ao deletar sala!");
    }
  
    setOpenDeleteModal(false);
    setDeleteRoomId(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setDeleteRoomId(null);
  };

  return (
    <Container>
      <ToastContainer />  
      <Typography variant="h4" gutterBottom>
        Gerenciar Salas
      </Typography>

      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        <TextField 
          label="Nome da Sala" 
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
            Deseja {editingIndex !== null ? "editar" : "cadastrar"} a sala?
          </Typography>
          <Button variant="contained" onClick={handleAddOrEdit} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ mt: 2 }}>Não</Button>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={handleDeleteCancel}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">Tem certeza que deseja excluir esta sala?</Typography>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={handleDeleteCancel} sx={{ mt: 2 }}>Não</Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Sala</TableCell>
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
