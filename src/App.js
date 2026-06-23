import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CssBaseline,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityNotificationsPage from './pages/PriorityNotificationsPage';
import logger from './utils/logger';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function NavigationLogger() {
  const location = useLocation();

  useEffect(() => {
    logger.info('Navigation', 'Page navigated', { path: location.pathname });
  }, [location]);

  return null;
}

function NavBar() {
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Campus Notifications
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<NotificationsIcon />}
        >
          All
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/priority"
          startIcon={<PriorityHighIcon />}
        >
          Priority
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  useEffect(() => {
    logger.info('App', 'Application loaded');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavigationLogger />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <Container component="main" sx={{ flex: 1, py: 2 }}>
            <Routes>
              <Route path="/" element={<AllNotificationsPage />} />
              <Route path="/priority" element={<PriorityNotificationsPage />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
