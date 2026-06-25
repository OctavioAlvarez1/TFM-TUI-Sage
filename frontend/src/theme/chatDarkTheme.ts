import { createTheme } from '@mui/material/styles';

// Dark theme used exclusively inside the chat widget
export const chatDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#10B981' },
    secondary:  { main: '#34D399' },
    background: { default: '#0D1B2A', paper: '#0F2236' },
    text:       { primary: '#F1F5F9', secondary: '#94A3B8' },
  },
  typography: { fontFamily: 'Inter, sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper:     { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAccordion: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
