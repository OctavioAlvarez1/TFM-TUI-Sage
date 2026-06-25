import { createTheme } from '@mui/material/styles';

// Spain Tourism palette — warm Mediterranean light theme
export const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#0369A1', light: '#38BDF8', dark: '#075985' },  // Mediterranean blue
    secondary:  { main: '#C2410C', light: '#FB923C', dark: '#9A3412' },  // Terracotta
    background: { default: '#FFFBF5', paper: '#FFFFFF' },
    text:       { primary: '#1C1917', secondary: '#78716C' },
    divider:    '#E7E5E4',
    error:      { main: '#DC2626' },
    warning:    { main: '#D97706' },
    success:    { main: '#65A30D' },
    info:       { main: '#0EA5E9' },
  },
  typography: { fontFamily: 'Inter, sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper:     { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar:    { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip:      { styleOverrides: { root: { fontWeight: 500 } } },
    MuiAccordion: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
