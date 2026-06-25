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
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '70%',
          background: 'radial-gradient(ellipse, rgba(22,163,74,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box maxWidth={1100} mx="auto" position="relative">
        {/* Section heading */}
        <Box textAlign="center" mb={6}>
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
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1.5px solid #166534',
            boxShadow: `
              0 0 0 6px rgba(22,163,74,0.08),
              0 32px 80px rgba(5,46,22,0.30),
              0 8px 24px rgba(0,0,0,0.15)
            `,
          }}
        >
          {/* Chrome top bar — dark forest green */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2.5,
              py: 1.3,
              background: 'linear-gradient(90deg, #052E16 0%, #14532D 60%, #166534 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              gap: 1.5,
            }}
          >
            {/* Traffic lights */}
            <Box display="flex" gap={0.65}>
              {['#4ADE80', '#FCD34D', '#FCA5A5'].map((c) => (
                <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c, opacity: 0.8 }} />
              ))}
            </Box>

            {/* Title centered */}
            <Box flex={1} display="flex" justifyContent="center" alignItems="center" gap={0.8}>
              <Box
                sx={{
                  width: 20, height: 20,
                  borderRadius: '6px 2px 6px 2px',
                  background: 'linear-gradient(145deg, #4ADE80 0%, #16A34A 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <SpaIcon sx={{ color: '#fff', fontSize: 12 }} />
              </Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 }}>
                Sage · Asesor de Destinos
              </Typography>
            </Box>

            <Box sx={{ width: 46 }} />
          </Box>

          {/* Body */}
          <Box sx={{ display: 'flex', height: CHAT_HEIGHT }}>
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
