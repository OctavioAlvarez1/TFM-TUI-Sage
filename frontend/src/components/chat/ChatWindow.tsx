import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
        sx={{ color: 'text.secondary', px: 4 }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(16,185,129,.12), transparent 70%)',
            border: '1px solid rgba(16,185,129,.2)',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 28, color: 'primary.main' }} />
        </Box>
        <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary' }}>
          Ask Sage anything about Spain's destinations
        </Typography>
        <Typography variant="body2" align="center" sx={{ maxWidth: 420, lineHeight: 1.6 }}>
          Grounded in real data on sustainability, congestion, and Horizon's recommendation
          engine. Use the example questions in the sidebar to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box flex={1} overflow="auto" px={3} py={2}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
