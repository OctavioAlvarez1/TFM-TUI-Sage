import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SpaIcon from '@mui/icons-material/Spa';
import PersonIcon from '@mui/icons-material/Person';
import LoadingDots from '../common/LoadingDots';
import SourcesPanel from './SourcesPanel';
import type { ChatMessage } from '../../types/chat';

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isUser ? 'flex-end' : 'flex-start'}
      mb={2.5}
    >
      {/* Avatar row */}
      <Box display="flex" alignItems="center" gap={1} mb={0.75} flexDirection={isUser ? 'row-reverse' : 'row'}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isUser ? '#DCFCE7' : '#F0FDF4',
            border: `1px solid ${isUser ? '#86EFAC' : '#BBF7D0'}`,
          }}
        >
          {isUser
            ? <PersonIcon sx={{ fontSize: 15, color: '#16A34A' }} />
            : <SpaIcon sx={{ fontSize: 15, color: '#16A34A' }} />
          }
        </Box>
        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
          {isUser ? 'Tú' : 'Sage'}
        </Typography>
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '78%',
          px: 2,
          py: 1.5,
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? '#DCFCE7' : '#F9FAFB',
          border: `1px solid ${isUser ? '#86EFAC' : '#E5E7EB'}`,
        }}
      >
        {message.isStreaming && message.content === '' ? (
          <LoadingDots />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: '#111827',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              '&::after': message.isStreaming
                ? {
                    content: '"│"',
                    color: '#16A34A',
                    animation: 'blink 1s step-end infinite',
                    ml: 0.2,
                  }
                : {},
            }}
          >
            {message.content}
          </Typography>
        )}
      </Box>

      {/* Sources accordion */}
      {!isUser && !message.isStreaming && (
        <Box sx={{ maxWidth: '78%', width: '100%' }}>
          <SourcesPanel sources={message.sources} />
        </Box>
      )}
    </Box>
  );
}
