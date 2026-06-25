import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './theme/darkTheme';
import Chat from './pages/Chat';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Chat />
    </ThemeProvider>
  );
}
