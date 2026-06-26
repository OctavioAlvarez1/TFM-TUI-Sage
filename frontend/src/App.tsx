import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProvider, useApp } from './context/AppContext';
import { createLightTheme, createDarkTheme } from './theme/darkTheme';
import Chat from './pages/Chat';

function ThemedApp() {
  const { mode } = useApp();
  const theme = useMemo(
    () => (mode === 'dark' ? createDarkTheme() : createLightTheme()),
    [mode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Chat />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
}
