import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { chatDarkTheme } from '../../theme/chatDarkTheme';
import StatusSidebar from '../chat/StatusSidebar';
import ChatWindow from '../chat/ChatWindow';
import ChatInput from '../chat/ChatInput';
import type { ChatMessage } from '../../types/chat';

interface ChatSectionProps {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (q: string) => void;
}

const CHAT_HEIGHT = 560;

export default function ChatSection({ messages, isLoading, sendMessage }: ChatSectionProps) {
  return (
    <Box
      component="section"
      id="chat"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
      }}
    >
      <Box maxWidth={1100} mx="auto">
        <Box textAlign="center" mb={4}>
          <Typography variant="overline" sx={{ color: '#16A34A', letterSpacing: 3, fontSize: '0.72rem', fontWeight: 700 }}>
            Pregunta a Sage
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={0.5} sx={{ color: '#111827' }}>
            Tu Asesor de Destinos con IA
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', mt: 1, maxWidth: 460, mx: 'auto' }}>
            Respuestas fundamentadas en datos reales de sostenibilidad, congestión y
            el motor de recomendación Horizon.
          </Typography>
        </Box>

        <ThemeProvider theme={chatDarkTheme}>
          <Box
            sx={{
              display: 'flex',
              height: CHAT_HEIGHT,
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,.1)',
              boxShadow: '0 24px 64px rgba(22,163,74,.10), 0 4px 16px rgba(0,0,0,.10)',
              background: '#0D1B2A',
            }}
          >
            <StatusSidebar onExampleClick={sendMessage} />
            <Box display="flex" flexDirection="column" flex={1} overflow="hidden">
              <ChatWindow messages={messages} />
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </Box>
          </Box>
        </ThemeProvider>
      </Box>
    </Box>
  );
}
