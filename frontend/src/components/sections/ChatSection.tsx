import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SpaIcon from '@mui/icons-material/Spa';
import StatusSidebar from '../chat/StatusSidebar';
import ChatWindow from '../chat/ChatWindow';
import ChatInput from '../chat/ChatInput';
import type { ChatMessage } from '../../types/chat';

interface ChatSectionProps {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (q: string) => void;
}

const CHAT_HEIGHT = 580;

export default function ChatSection({ messages, isLoading, sendMessage }: ChatSectionProps) {
  return (
    <Box
      component="section"
      id="chat"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
        position: 'relative',
        overflow: 'hidden',
        // Decorative radial glow behind widget
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(22,163,74,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box maxWidth={1100} mx="auto" position="relative">
        {/* Section heading */}
        <Box textAlign="center" mb={5}>
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

        {/* Chat widget */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1.5px solid #BBF7D0',
            boxShadow: '0 0 0 4px rgba(22,163,74,0.05), 0 20px 60px rgba(22,163,74,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          {/* Chrome top bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2.5,
              py: 1.2,
              background: 'linear-gradient(90deg, #DCFCE7 0%, #F0FDF4 60%, #FFFFFF 100%)',
              borderBottom: '1.5px solid #BBF7D0',
              gap: 1.5,
            }}
          >
            {/* Traffic lights */}
            <Box display="flex" gap={0.6}>
              {['#86EFAC', '#FCD34D', '#FCA5A5'].map((c) => (
                <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
              ))}
            </Box>

            {/* Title centered */}
            <Box flex={1} display="flex" justifyContent="center" alignItems="center" gap={0.8}>
              <Box
                sx={{
                  width: 20, height: 20,
                  borderRadius: '6px 2px 6px 2px',
                  background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <SpaIcon sx={{ color: '#fff', fontSize: 12 }} />
              </Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', letterSpacing: 0.5 }}>
                Sage · Asesor de Destinos
              </Typography>
            </Box>

            {/* Right spacer to balance traffic lights */}
            <Box sx={{ width: 46 }} />
          </Box>

          {/* Body */}
          <Box sx={{ display: 'flex', height: CHAT_HEIGHT, background: '#FFFFFF' }}>
            <StatusSidebar onExampleClick={sendMessage} />
            <Box display="flex" flexDirection="column" flex={1} overflow="hidden">
              <ChatWindow messages={messages} />
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
