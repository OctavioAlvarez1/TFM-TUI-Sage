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
        position: 'relative',
        overflow: 'hidden',
        // Sevilla Plaza de España como fondo con efecto desvaneciente
        backgroundImage: 'url(/stat-datos.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        // Fade lineal en bordes superior e inferior
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 80%, rgba(240,253,244,0.70) 100%),
            linear-gradient(90deg,  rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 84%, rgba(255,255,255,0.60) 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        },
        // Vignette radial — desvanece la foto hacia los bordes dejando el centro visible
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 65% at 50% 58%, transparent 0%, rgba(255,255,255,0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Box maxWidth={1100} mx="auto" position="relative" zIndex={1}>
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
            border: '2px solid #2D6A4F',
            background: '#FFFFFF',
            boxShadow: `
              0 0 0 8px rgba(255,255,255,1),
              0 0 0 10px #2D6A4F,
              0 0 0 14px rgba(255,255,255,0.60),
              0 40px 100px rgba(0,0,0,0.50),
              0 10px 30px rgba(0,0,0,0.30)
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
              background: 'linear-gradient(90deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)',
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
