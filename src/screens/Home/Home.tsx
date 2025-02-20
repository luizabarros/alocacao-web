import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const HomePage = () => {
  const drawerWidth = 240;
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('home');

  const toggleDrawer = () => {
    setOpen(!open); 
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  const menuItems = [
    { name: 'home', label: 'Home' },
    { name: 'horarios', label: 'Horários' },
    { name: 'salas', label: 'Salas' },
    { name: 'disciplinas', label: 'Disciplinas' },
    { name: 'professores', label: 'Professores' },
    { name: 'sair', label: 'Sair' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ width: `100%` }}>
        <Toolbar>
          <MenuIcon onClick={toggleDrawer} />
          <Typography ml={3}>
            Gerenciamento de Alocação
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'absolute',
            top: '64px',
          },
        }}
        variant="persistent" 
        anchor="left"
        open={open}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              sx={{
                backgroundColor: selectedItem === item.name ? '#f0f0f0' : 'transparent',
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: 3,
          marginTop: '60px'
        }}
      >
        <Typography>
          Este é o conteúdo da sua página inicial. Você pode personalizá-lo conforme necessário.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
