import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { createLecture, deleteLecture, getLectures, getDayOfWeek, updateLecture } from "../../../services/lectureService";
import { getRooms } from "../../../services/roomService";
import { listSubjects } from "../../../services/subjectService";
import { useAuth } from "../../../contexts/AuthContext";

const schedules = ["07:00", "07:50", "08:40", "09:30", "10:20", "11:10"];

const RoomManagement = () => {
  const { token } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [hourInit, setHourInit] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [duration, setDuration] = useState("PT50M");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (token) {
      fetchLectures();
      fetchRooms();
      fetchSubjects();
      fetchDaysOfWeek();
    }
  }, [token]);

  useEffect(() => {
    subjects.forEach(subject =>
      console.log(`Disciplina: ${subject.name}, Professor: ${subject.professorName ?? "Não encontrado"}`)
    );
  }, [subjects]);


  const fetchLectures = async () => {
    try {
      const data = await getLectures();
      setLectures(data);
    } catch (error) {
      toast.error("Erro ao carregar as alocações.");
      console.error(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      toast.error("Erro ao carregar as salas.");
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await listSubjects();
      setSubjects(data);
    } catch (error) {
      toast.error("Erro ao carregar as disciplinas.");
      console.error(error);
    }
  };

  const fetchDaysOfWeek = async () => {
    try {
      const data = await getDayOfWeek();
      setDaysOfWeek(data);
    } catch (error) {
      toast.error("Erro ao carregar os dias da semana.");
      console.error(error);
    }
  };

  const extractMinutes = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
  
    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;
  
    return hours * 60 + minutes + Math.round(seconds / 60);
  };

  const handleAddClass = async () => {
    if (!subjectId || !roomId || !dayOfWeek || !hourInit || !duration) {
      toast.error("⚠️ Todos os campos são obrigatórios!");
      return;
    }

    if (extractMinutes(duration) % 50 !== 0) {
      toast.error("A duração deve ser múltipla de 50 minutos.");
      return;
    }

    const newLecture = {
      subjectId,
      roomId,
      dayOfWeek,
      hourInit,
      duration,
    };

    try {
      await createLecture(newLecture);
      toast.success("✅ Aula alocada com sucesso!");
      fetchLectures(); 
      resetForm(); 
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };



  const handleEditClass = (lecture) => {
    setSubjectId(lecture.subjectId);
    setRoomId(lecture.roomId);
    setDayOfWeek(lecture.dayOfWeek);
    setHourInit(lecture.hourInit);
    setDuration(lecture.duration);
    setEditId(lecture.id || null);
  };

  const handleUpdateClass = async () => {
    if (!editId) return;

    const updatedLecture = {
      subjectId,
      roomId,
      dayOfWeek,
      hourInit,
      duration,
    };

    if (extractMinutes(duration) % 50 !== 0) {
      toast.error("A duração deve ser múltipla de 50 minutos.");
      return;
    }

    try {
      await updateLecture(editId, updatedLecture);
      toast.success("✅ Aula atualizada com sucesso!");
      fetchLectures();
      resetForm();
    } catch (error) {
      console.error("❌ Erro ao atualizar aula:", error.message);
      const errorMessage = error.response?.data?.message || "Erro ao atualizar aula.";
      toast.error(`❌ ${error.message}`);
      resetForm();
    }
  };
  

  const handleDeleteClass = async () => {
    if (!deleteId) {
      console.error("❌ Nenhum ID para deletar!");
      return;
    }

    try {
      await deleteLecture(deleteId);
      toast.success("✅ Aula excluída com sucesso!");
      fetchLectures(); 

      setOpenDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error("❌ Erro ao excluir aula:", error.message);
      toast.error(`❌ ${error.message}`);
    }
  };

  const handleDeleteConfirmation = (lectureId) => {
    setDeleteId(lectureId);
    setOpenDialog(true);
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Desconhecido";
  };

  const getRoomName = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : "Desconhecido";
  };

  const getProfessorName = (subjectId) => {
    if (!subjects || subjects.length === 0) {
      return "Carregando...";
    }

    const subject = subjects.find((s) => s.id === subjectId);

    if (!subject) {
      return "Não atribuído";
    }

    return subject.professorName ?? "Não atribuído";
  };


  const resetForm = () => {
    setSubjectId("");
    setRoomId("");
    setDayOfWeek("");
    setDuration("PT50M");
    setEditId(null);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Gerenciamento das Aulas</Typography>

      <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Disciplina</MenuItem>
        {subjects.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
      </Select>

      <Select value={roomId} onChange={(e) => setRoomId(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Sala</MenuItem>
        {rooms.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
      </Select>

      <Select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Dia da Semana</MenuItem>
        {daysOfWeek.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
      </Select>

      <Select value={hourInit} onChange={(e) => setHourInit(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Horário</MenuItem>
        {schedules.map((s) => <MenuItem key={s} value={`${s}:00`}>{s}</MenuItem>)}

      </Select>

      <TextField
        label="Duração (múltiplos de 50 min)"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={duration ? extractMinutes(duration) : ""}
        onChange={(e) => {
          const minutes = Number(e.target.value);
          setDuration(`PT${minutes}M`);
        }}
      />
      <Button
        onClick={() => {
          if (editId) {
            handleUpdateClass();
          } else {
            handleAddClass();
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {editId ? "Atualizar Aula" : "Alocar Aula"}
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture.id}>
                <TableCell>{getSubjectName(lecture.subjectId)}</TableCell>
                <TableCell>{getProfessorName(lecture.subjectId)}</TableCell>
                <TableCell>{getRoomName(lecture.roomId)}</TableCell>
                <TableCell>{lecture.dayOfWeek}</TableCell>
                <TableCell>{lecture.hourInit}</TableCell>
                <TableCell>{lecture.duration} min</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClass(lecture)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      console.log("🗑️ Preparando exclusão para ID:", lecture.id);
                      setDeleteId(lecture.id || null);
                      setOpenDialog(true);
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja excluir esta aula?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              console.log("✅ Confirmando exclusão de aula ID:", deleteId);
              handleDeleteClass();
            }}
            color="error"
          >
            Excluir
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

    </Container >
  );
};

export default RoomManagement;