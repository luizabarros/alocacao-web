import { useState } from "react";
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

  const totalRooms = 10;
  const totalSubjects = 15;
  const totalClasses = 35;

  const timeslots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const classes = [
    { subject: "Matemática (T1)", room: "101", teacher: "Dr. Smith", day: "Segunda", time: "08:00" },
    { subject: "História (T2)", room: "102", teacher: "Prof. Johnson", day: "Terça", time: "10:00" },
    { subject: "Física (T3)", room: "103", teacher: "Dr. Adams", day: "Quarta", time: "14:00" },
    { subject: "Quimica (T4)", room: "104", teacher: "Prof. Brown", day: "Quinta", time: "16:00" },
  ];

  const filteredClasses = classes.filter(cls =>
    (roomFilter === "" || cls.room === roomFilter) &&
    (subjectFilter === "" || cls.subject === subjectFilter) &&
    (teacherFilter === "" || cls.teacher === teacherFilter)
  );

  const uniqueSubjects = [...new Set(classes.map(cls => cls.subject))];
  const uniqueTeachers = [...new Set(classes.map(cls => cls.teacher))];

  const cardStyle = { backgroundColor: "#00b4d8" };

  return (
    <>
      <Container sx={{ marginTop: 4 }}>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
          <Card>
            <CardContent sx={cardStyle}>
              <Typography variant="h5">
                <School /> Salas: {totalRooms}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={cardStyle}>
              <Typography variant="h5">
                <Class /> Disciplinas: {totalSubjects}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={cardStyle}>
              <Typography variant="h5">
                <EventAvailable /> Turmas: {totalClasses}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box display="flex" gap={2} marginTop={4}>
          <FormControl fullWidth>
            <InputLabel>Filtro por sala</InputLabel>
            <Select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="101">Sala 101</MenuItem>
              <MenuItem value="102">Sala 102</MenuItem>
              <MenuItem value="103">Sala 103</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Filtro por disciplina</InputLabel>
            <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {uniqueSubjects.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Filtro por professor</InputLabel>
            <Select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {uniqueTeachers.map((teacher) => (
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
                {days.map((day) => (
                  <TableCell key={day}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeslots.map((time) => (
                <TableRow key={time}>
                  <TableCell>{time}</TableCell>
                  {days.map((day) => (
                    <TableCell key={day}>
                      {filteredClasses.find((cls) => cls.day === day && cls.time === time)?.subject || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
