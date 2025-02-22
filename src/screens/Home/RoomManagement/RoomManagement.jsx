import React, { useState } from "react";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast, ToastContainer } from 'react-toastify';

const schedules = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const rooms = ["101", "102", "103", "104"];
const subjects = ["Matemática", "Português", "História", "Física"];
const classCodes = ["A101", "B202", "C303", "D404"];

const initialClasses = [
  { subject: "Matemática", classCode: "A101", room: "101", schedule: "08:00" },
  { subject: "Português", classCode: "B202", room: "102", schedule: "09:00" },
  { subject: "História", classCode: "C303", room: "103", schedule: "10:00" },
  { subject: "Física", classCode: "D404", room: "104", schedule: "11:00" },
];

const RoomManagement = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [subject, setSubject] = useState("");
  const [classCode, setClassCode] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddClass = () => {
    if (!subject || !classCode || !room || !schedule) return;
    
    const conflict = classes.some(
      (cls) => cls.room === room && cls.schedule === schedule
    );
    
    if (conflict) {
      toast.error("Conflito de horário! A sala está ocupada.");
      return;
    }

    const newClass = { subject, classCode, room, schedule };
    if (editIndex !== null) {
      const updatedClasses = [...classes];
      updatedClasses[editIndex] = newClass;
      setClasses(updatedClasses);
      setEditIndex(null);
    } else {
      setClasses([...classes, newClass]);
    }
    setSubject("");
    setClassCode("");
    setRoom("");
    setSchedule("");
  };

  const handleEditClass = (index) => {
    const cls = classes[index];
    setSubject(cls.subject);
    setClassCode(cls.classCode);
    setRoom(cls.room);
    setSchedule(cls.schedule);
    setEditIndex(index);
  };

  const handleDeleteClass = () => {
    setClasses(classes.filter((_, i) => i !== deleteIndex));
    setOpenDialog(false);
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Gerenciamento das Alocações</Typography>
      <Select value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Disciplina</MenuItem>
        {subjects.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <Select value={classCode} onChange={(e) => setClassCode(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Código da Turma</MenuItem>
        {classCodes.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </Select>
      <Select value={room} onChange={(e) => setRoom(e.target.value)} fullWidth displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="" disabled>Selecionar Sala</MenuItem>
        {rooms.map((r) => (
          <MenuItem key={r} value={r}>{r}</MenuItem>
        ))}
      </Select>
      <Select value={schedule} onChange={(e) => setSchedule(e.target.value)} fullWidth displayEmpty>
        <MenuItem value="" disabled>Selecionar Horário</MenuItem>
        {schedules.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <Button 
        onClick={handleAddClass} 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        disabled={!subject || !classCode || !room || !schedule}
      >
        {editIndex !== null ? "Atualizar sala" : "Alocar sala"}
      </Button>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>Cod Turma</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls, index) => (
              <TableRow key={index}>
                <TableCell>{cls.subject}</TableCell>
                <TableCell>{cls.classCode}</TableCell>
                <TableCell>{cls.room}</TableCell>
                <TableCell>{cls.schedule}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClass(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => { setDeleteIndex(index); setOpenDialog(true); }} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja excluir esta alocação de sala?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteClass} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomManagement;
