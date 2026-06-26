import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import SpaIcon from '@mui/icons-material/Spa';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import NatureIcon from '@mui/icons-material/Nature';
import { useTheme } from '@mui/material/styles';
import MessageBubble from './MessageBubble';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import type { ChatMessage, FeedbackType } from '../../types/chat';

const CAPABILITY_ICONS = [MapIcon, BarChartIcon, NatureIcon];

// City photos already in /public — used as background collage
const CITY_PHOTOS = [
  '/stat-destinos.jpg',
  '/stat-concentracion.jpg',
  '/stat-datos.jpg',
  '/stat-documentos.jpg',
];

interface Props {
  messages: ChatMessage[];
  onFeedback: (messageId: string, feedback: FeedbackType) => void;
}

export default function ChatWindow({ messages, onFeedback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useApp();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const T = translations[lang];

  const CAPABILITIES = [
    { Icon: CAPABILITY_ICONS[0], label: T.cw_chip_1 },
    { Icon: CAPABILITY_ICONS[1], label: T.cw_chip_2 },
    { Icon: CAPABILITY_ICONS[2], label: T.cw_chip_3 },
  ];

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
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
          background: theme.palette.background.paper,
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

        {/* Overlay — adapts to mode */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute', inset: 0,
            background: isDark ? 'rgba(13,17,23,0.88)' : 'rgba(255,255,255,0.88)',
            zIndex: 1,
          }}
        />

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
                background: isDark
                  ? 'linear-gradient(145deg, #1B3929 0%, #0f2318 100%)'
                  : 'linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 100%)',
                border: `2px solid ${isDark ? '#2D6A4F' : '#86EFAC'}`,
                boxShadow: '0 4px 24px rgba(22,163,74,0.18)',
                position: 'relative',
              }}
            >
              <SpaIcon sx={{ fontSize: 34, color: '#16A34A' }} />
            </Box>
          </Box>

          <Box textAlign="center">
            <Typography variant="body1" fontWeight={800} sx={{ color: theme.palette.text.primary, mb: 0.5, fontSize: '1.05rem' }}>
              {T.cw_empty_title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 380, mx: 'auto', lineHeight: 1.6 }}>
              {T.cw_empty_subtitle}
            </Typography>
          </Box>

          {/* Capability chips */}
          <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
            {CAPABILITIES.map(({ Icon, label }) => (
              <Chip
                key={label}
                icon={<Icon sx={{ fontSize: '14px !important', color: '#16A34A !important' }} />}
                label={label}
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(22,27,34,0.85)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${isDark ? '#2D6A4F' : '#BBF7D0'}`,
                  color: isDark ? '#4ADE80' : '#15803D',
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
      ref={containerRef}
      flex={1}
      overflow="auto"
      px={3}
      py={2}
      sx={{ background: theme.palette.background.paper }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onFeedback={onFeedback} />
      ))}
    </Box>
  );
}
