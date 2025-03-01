import React, { useState, useEffect } from "react";
import { Room, getRooms } from "../../../services/roomService";
import { listSubjects } from "../../../services/subjectService";
import { getProfessors } from "../../../services/professorService";
import { getDayOfWeek, getLectures, Lecture } from "../../../services/lectureService";

import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { School, Class, EventAvailable } from "@mui/icons-material";

const Dashboard = () => {
  const [roomFilter, setRoomFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string; professorName?: string }[]>([]);
  const [professors, setProfessors] = useState<string[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

  const timeslots = ["08:00", "08:50", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  // 🔹 Transformamos `lectures` para incluir o nome da disciplina e do professor
  const filteredClasses = lectures
    .map((lecture) => {
      const subject = subjects.find((s) => s.id === lecture.subjectId);
      return {
        ...lecture,
        subjectName: subject?.name || "Sem nome",
        teacher: subject?.professorName || "Não atribuído", 
      };
    })
    .filter((cls) =>
      (roomFilter === "" || cls.roomId === roomFilter) &&
      (subjectFilter === "" || cls.subjectId === subjectFilter) &&
      (teacherFilter === "" || cls.teacher === teacherFilter)
    );

  useEffect(() => {
    const fetchDaysOfWeek = async () => {
      try {
        const data = await getDayOfWeek();
        if (Array.isArray(data)) {
          setDaysOfWeek(data.map(String)); // Garante que são strings
        } else {
          console.error("Erro: os dados retornados não são um array de strings.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dias da semana:", error);
      }
    };

    fetchDaysOfWeek();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    };

    fetchLectures();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data: Room[] = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await listSubjects();
        setSubjects(data); 
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    };

    fetchRooms();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const data = await getProfessors();
        const formattedProfessors = data.map((professor) => professor.name);
        setProfessors(formattedProfessors);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    };

    fetchProfessors();
  }, []);

  const cardStyle = { backgroundColor: "#00b4d8" };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
        <Card>
          <CardContent sx={cardStyle}>
            <Typography variant="h5">
              <School /> Salas: {rooms.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={cardStyle}>
            <Typography variant="h5">
              <Class /> Disciplinas: {subjects.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={cardStyle}>
            <Typography variant="h5">
              <EventAvailable /> Aulas: {lectures.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" gap={2} marginTop={4}>
        <FormControl fullWidth>
          <InputLabel>Filtro por sala</InputLabel>
          <Select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Filtro por disciplina</InputLabel>
          <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <MenuItem value="">Todas</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Filtro por professor</InputLabel>
          <Select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {professors.map((teacher) => (
              <MenuItem key={teacher} value={teacher}>
                {teacher}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Horários</TableCell>
              {daysOfWeek.map((day) => (
                <TableCell key={day}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeslots.map((time) => (
              <TableRow key={time}>
                <TableCell>{time}</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day}>
                    {filteredClasses.find((cls) => cls.dayOfWeek === day && cls.hourInit === time)?.subjectName || "-"}
                    <br />
                    <Typography variant="caption">
                      {filteredClasses.find((cls) => cls.dayOfWeek === day && cls.hourInit === time)?.teacher || "-"}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Dashboard;
