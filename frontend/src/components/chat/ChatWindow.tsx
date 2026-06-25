import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import SpaIcon from '@mui/icons-material/Spa';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import NatureIcon from '@mui/icons-material/Nature';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../../types/chat';

const CAPABILITIES = [
  { icon: MapIcon,      label: '20 destinos' },
  { icon: BarChartIcon, label: 'Datos INE' },
  { icon: NatureIcon,   label: 'Sostenibilidad' },
];

interface Props {
  messages: ChatMessage[];
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2.5}
        sx={{ px: 4, background: '#FFFFFF' }}
      >
        {/* Pulsing icon */}
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              background: 'rgba(22,163,74,0.08)',
              animation: 'pulse 2.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
                '50%':       { transform: 'scale(1.18)', opacity: 0.15 },
              },
            }}
          />
          <Box
            sx={{
              width: 72, height: 72,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 100%)',
              border: '2px solid #86EFAC',
              boxShadow: '0 4px 24px rgba(22,163,74,0.18)',
              position: 'relative',
            }}
          >
            <SpaIcon sx={{ fontSize: 34, color: '#16A34A' }} />
          </Box>
        </Box>

        <Box textAlign="center">
          <Typography variant="body1" fontWeight={800} sx={{ color: '#111827', mb: 0.5, fontSize: '1.05rem' }}>
            Pregunta a Sage sobre los destinos de España
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', maxWidth: 380, mx: 'auto', lineHeight: 1.6 }}>
            Respuestas fundamentadas en datos reales. Usa los ejemplos del lateral o escribe tu propia pregunta.
          </Typography>
        </Box>

        {/* Capability chips */}
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
          {CAPABILITIES.map(({ icon: Icon, label }) => (
            <Chip
              key={label}
              icon={<Icon sx={{ fontSize: '14px !important', color: '#16A34A !important' }} />}
              label={label}
              size="small"
              sx={{
                bgcolor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                fontWeight: 600,
                fontSize: '0.72rem',
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} overflow="auto" px={3} py={2} sx={{ background: '#FFFFFF' }}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
