import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  // Puedes definir sombras personalizadas aquí
});

export default theme;
