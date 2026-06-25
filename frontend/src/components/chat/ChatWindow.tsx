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

// City photos already in /public — used as background collage
const CITY_PHOTOS = [
  '/stat-destinos.jpg',      // Barcelona aerial
  '/stat-concentracion.jpg', // Madrid Gran Vía
  '/stat-datos.jpg',         // Sevilla Plaza España
  '/stat-documentos.jpg',    // Barcelona Casa Batlló
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
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 2×2 city photo collage background */}
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', zIndex: 0 }}>
          {CITY_PHOTOS.map((src) => (
            <Box
              key={src}
              sx={{
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(6px) saturate(0.7)',
                transform: 'scale(1.08)',
              }}
            />
          ))}
        </Box>

        {/* White overlay — heavy so content is readable */}
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.88)', zIndex: 1 }} />

        {/* Content */}
        <Box
          sx={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2.5, px: 4,
          }}
        >
          {/* Pulsing icon */}
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute', inset: -10,
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
                width: 72, height: 72, borderRadius: '50%',
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
                  bgcolor: 'rgba(255,255,255,0.85)',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  backdropFilter: 'blur(4px)',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      overflow="auto"
      px={3}
      py={2}
      sx={{
        background: '#FFFFFF',
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
