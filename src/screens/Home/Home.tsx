import React, { createContext, useContext, ReactNode } from "react";
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  CssBaseline, 
  Dialog, 
  DialogActions, 
  DialogContent,
  DialogTitle, 
  Button, 
  IconButton, 
  createTheme, 
  ThemeProvider 
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Dashboard from './Dashboard/Dashboard';
import RoomManagement from './RoomManagement/RoomManagement';
import Subject from './Subject/Subject';
import Room from './Room/Room';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItemType {
  name: string;
  label: string;
  isAdminScreen: boolean;
}

const HomePage: React.FC = () => {
  const drawerWidth = 240;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("home");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const { logout, isAdmin } = useAuth();

  const menuItems: MenuItemType[] = [
    { name: "home", label: "Home", isAdminScreen: false },
    { name: "gerenciar-salas", label: "Gerenciamento das Alocações", isAdminScreen: false },
    { name: "disciplina", label: "Disciplinas", isAdminScreen: true },
    { name: "sala", label: "Salas", isAdminScreen: true },
    { name: "sair", label: "Sair", isAdminScreen: false },
  ];

  const toggleDrawer = (): void => {
    setOpen(!open); 
  };

  const handleItemClick = (item: MenuItemType): void => {
    setSelectedItem(item.name);
    setOpen(false); 
  
    if (item.name === "sair") {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleLogout = (): void => {
    logout();
    setOpenDialog(false);
  };

  const handleThemeChange = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar position="fixed" sx={{ width: "100%" }}>
          <Toolbar>
            <IconButton onClick={toggleDrawer} color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography ml={3}>
              Gerenciamento de Alocação {isAdmin && "(Administrador)"}
            </Typography>
            <IconButton onClick={handleThemeChange} sx={{ marginLeft: "auto" }} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "absolute",
              top: "64px",
            },
          }}
          variant="persistent" 
          anchor="top"
          open={open}
        >
          <List>
            {menuItems.map((item) => (
              item.isAdminScreen && !isAdmin ? null :
              <ListItem
                key={item.name}
                onClick={() => handleItemClick(item)}
                sx={{
                  backgroundColor: selectedItem === item.name && isDarkMode 
                    ? "#555555"
                    : selectedItem === item.name && !isDarkMode 
                    ? "#e9e9e9"
                    : "transparent",
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", padding: 3, marginTop: "60px" }}>
          {selectedItem === "home" ? <Dashboard /> :
           selectedItem === "gerenciar-salas" ? <RoomManagement /> :
           selectedItem === "disciplina" ? <Subject/> :
           selectedItem === "sala" ? <Room/> : null}
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirmar Logout</DialogTitle>
          <DialogContent>
            Tem certeza de que deseja deslogar?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleLogout} color="primary">
              Sim, deslogar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
