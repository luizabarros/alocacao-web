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
import { toast, ToastContainer } from "react-toastify";

interface ClassSchedule {
  subject: string;
  codClass: string;
  room: string;
  schedule: string;
}

const schedules = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const rooms = ["101", "102", "103", "104"];
const subjects = ["Matemática", "Português", "História", "Física"];
const codClasss = ["A101", "B202", "C303", "D404"];

const initialClasses: ClassSchedule[] = [
  { subject: "Matemática", codClass: "A101", room: "101", schedule: "08:00" },
  { subject: "Português", codClass: "B202", room: "102", schedule: "09:00" },
  { subject: "História", codClass: "C303", room: "103", schedule: "10:00" },
  { subject: "Física", codClass: "D404", room: "104", schedule: "11:00" },
];

const RoomManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassSchedule[]>(initialClasses);
  const [subject, setSubject] = useState<string>("");
  const [codClass, setCodClass] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [schedule, setSchedule] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleAddClass = (): void => {
    if (!subject || !codClass || !room || !schedule) return;

    const conflict = classes.some((cls) => cls.room === room && cls.schedule === schedule);
    if (conflict) {
      toast.error("Conflito de horário! A sala está ocupada.");
      return;
    }

    const newClass: ClassSchedule = { subject, codClass, room, schedule };
    if (editIndex !== null) {
      const updatedClasses = [...classes];
      updatedClasses[editIndex] = newClass;
      setClasses(updatedClasses);
      setEditIndex(null);
    } else {
      setClasses([...classes, newClass]);
    }
    setSubject("");
    setCodClass("");
    setRoom("");
    setSchedule("");
  };

  const handleEditClass = (index: number): void => {
    const cls = classes[index];
    setSubject(cls.subject);
    setCodClass(cls.codClass);
    setRoom(cls.room);
    setSchedule(cls.schedule);
    setEditIndex(index);
  };

  const handleDeleteClass = (): void => {
    if (deleteIndex !== null) {
      setClasses(classes.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setOpenDialog(false);
    }
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

      <Button onClick={handleAddClass} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
        disabled={!subject || !codClass || !room || !schedule}>
        {editIndex !== null ? "Atualizar sala" : "Alocar sala"}
      </Button>

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

