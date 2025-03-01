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
import { getRooms, createRoom, updateRoom, deleteRoom, Room } from "../../../services/roomService";

const RoomComponent: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (editingRoom) {
      setRoomName(editingRoom.name); // ✅ Agora o nome da sala aparece corretamente no modal de edição
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

  const resetFields = () => {
    setRoomName("");
    setEditingRoom(null);
  };

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setRoomName(room.name);
    } else {
      // ✅ Agora mantém o valor digitado ao abrir a tela de criação
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

  const handleDelete = (room: Room) => {
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
          disabled={!roomName.trim()} // ✅ Impede que o botão seja clicado com campo vazio
        >
          {editingRoom ? "Editar" : "Adicionar"}
        </Button>
      </Stack>

      {/* ✅ MODAL PARA CRIAR/EDITAR SALA */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">
            {editingRoom ? "Editar Sala" : "Cadastrar Sala"}
          </Typography>

          <TextField
            label="Nome da Sala"
            value={roomName} // ✅ Agora o nome digitado aparece corretamente no campo do modal
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

      {/* ✅ MODAL DE CONFIRMAÇÃO PARA DELETAR */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6">Tem certeza que deseja excluir esta sala?</Typography>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ mr: 2, mt: 2 }}>Sim</Button>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ mt: 2 }}>Não</Button>
        </Box>
      </Modal>

      {/* ✅ TABELA COM AS SALAS */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenModal(room)} sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(room)}>
                    Deletar
                  </Button>
                </TableCell> {/* ✅ Fechamento correto */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RoomComponent;
