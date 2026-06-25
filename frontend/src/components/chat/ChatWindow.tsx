import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SpaIcon from '@mui/icons-material/Spa';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../../types/chat';

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
        gap={2}
        sx={{ px: 4, background: '#FFFFFF' }}
      >
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 100%)',
            border: '2px solid #86EFAC',
            boxShadow: '0 4px 20px rgba(22,163,74,0.15)',
          }}
        >
          <SpaIcon sx={{ fontSize: 30, color: '#16A34A' }} />
        </Box>
        <Typography variant="body1" fontWeight={700} sx={{ color: '#111827' }}>
          Pregunta a Sage sobre los destinos de España
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: '#6B7280', maxWidth: 400, lineHeight: 1.6 }}>
          Respuestas fundamentadas en datos reales de sostenibilidad y congestión.
          Usa las preguntas de ejemplo del lateral para empezar.
        </Typography>
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
