import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
            bgcolor: isUser ? 'rgba(16,185,129,.15)' : 'rgba(99,102,241,.15)',
            border: `1px solid ${isUser ? 'rgba(16,185,129,.3)' : 'rgba(99,102,241,.3)'}`,
          }}
        >
          {isUser
            ? <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            : <AutoAwesomeIcon sx={{ fontSize: 16, color: '#6366F1' }} />
          }
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {isUser ? 'You' : 'Sage'}
        </Typography>
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '78%',
          px: 2,
          py: 1.5,
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'rgba(16,185,129,.12)'
            : 'rgba(255,255,255,.05)',
          border: `1px solid ${isUser ? 'rgba(16,185,129,.22)' : 'rgba(255,255,255,.1)'}`,
          backdropFilter: isUser ? 'none' : 'blur(16px)',
        }}
      >
        {message.isStreaming && message.content === '' ? (
          <LoadingDots />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              '&::after': message.isStreaming
                ? {
                    content: '"│"',
                    color: 'primary.main',
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

      {/* Sources accordion — shown after streaming finishes */}
      {!isUser && !message.isStreaming && (
        <Box sx={{ maxWidth: '78%', width: '100%' }}>
          <SourcesPanel sources={message.sources} />
        </Box>
      )}
    </Box>
  );
}
