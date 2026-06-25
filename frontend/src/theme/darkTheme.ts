import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#10B981' },
    secondary: { main: '#34D399' },
    background: { default: '#070C16', paper: '#0F1A2E' },
    text: { primary: '#F1F5F9', secondary: '#94A3B8' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});
