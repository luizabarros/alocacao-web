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
import { toast, ToastContainer } from "react-toastify";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../../services/roomService";

const RoomComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [filterName, rooms]);

  useEffect(() => {
    if (editingRoom) {
      setRoomName(editingRoom.name);
    }
  }, [editingRoom]);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      toast.error("Erro ao carregar salas.");
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    if (filterName) {
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const resetFields = () => {
    setRoomName("");
    setEditingRoom(null);
  };

  const handleOpenModal = (room) => {
    if (room) {
      setEditingRoom(room);
      setRoomName(room.name);
    } else {
      setEditingRoom(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    resetFields();
    setOpenModal(false);
  };

  const handleAddOrEdit = async () => {
    if (!roomName.trim()) {
      toast.error("Por favor, preencha o nome da sala!");
      return;
    }

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomName);
        toast.success("Sala editada com sucesso!");
      } else {
        await createRoom(roomName);
        toast.success("Sala adicionada com sucesso!");
      }

      fetchRooms();
      handleCloseModal();
    } catch (error) {
      toast.error("Erro ao salvar sala.");
    }
  };

  const handleDelete = (room) => {
    setDeleteRoomId(room.id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRoomId) {
      toast.error("Erro: ID da sala não encontrado.");
      return;
    }

    try {
      await deleteRoom(deleteRoomId);
      toast.success("Sala deletada com sucesso!");
      fetchRooms();
    } catch (error) {
      toast.error("Erro ao deletar sala.");
    }

    setOpenDeleteModal(false);
    setDeleteRoomId(null);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Gerenciar Salas
      </Typography>

      {/* Filtro por nome */}
      <TextField
        label="Filtrar por nome"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <TextField 
          label="Nome da Sala" 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} 
          fullWidth 
        />

        <Button
          onClick={() => handleOpenModal()}
          variant="contained"
          fullWidth
          disabled={!roomName.trim()} 
        >
          {editingRoom ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#548dbd", padding: 4, borderRadius: 2, boxShadow: 24, color: "#000000" 
        }}>
          <Typography variant="h6">
            {editingRoom ? "Editar Sala" : "Cadastrar Sala"}
          </Typography>

          <TextField
            label="Nome da Sala"
            value={roomName} 
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
            sx={{ my: 2 }}
          />

          <Button variant="contained" onClick={handleAddOrEdit} sx={{ mr: 2, mt: 2 }}>
            {editingRoom ? "Salvar Alterações" : "Criar"}
          </Button>

          <Button variant="outlined" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#212121", padding: 4, borderRadius: 2, boxShadow: 24, color: "#fff" 
        }}>
          <Typography variant="h6">Tem certeza que deseja excluir esta sala?</Typography>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ mt: 2 }}>Não</Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenModal(room)} sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(room)}>
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

export default RoomComponent;
