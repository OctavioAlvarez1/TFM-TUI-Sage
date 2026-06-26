import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SpaIcon from '@mui/icons-material/Spa';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useTheme } from '@mui/material/styles';
import LoadingDots from '../common/LoadingDots';
import SourcesPanel from './SourcesPanel';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import type { ChatMessage, FeedbackType } from '../../types/chat';

interface Props {
  message: ChatMessage;
  onFeedback?: (messageId: string, feedback: FeedbackType) => void;
}

export default function MessageBubble({ message, onFeedback }: Props) {
  const isUser = message.role === 'user';
  const showFeedback = !isUser && !message.isStreaming && !!onFeedback;
  const { lang } = useApp();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const T = translations[lang];

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
            bgcolor: isDark
              ? (isUser ? '#1B3929' : '#161B22')
              : (isUser ? '#DCFCE7' : '#F0FDF4'),
            border: `1px solid ${isDark ? (isUser ? '#2D6A4F' : '#30363D') : (isUser ? '#86EFAC' : '#BBF7D0')}`,
          }}
        >
          {isUser
            ? <PersonIcon sx={{ fontSize: 15, color: '#16A34A' }} />
            : <SpaIcon sx={{ fontSize: 15, color: '#16A34A' }} />
          }
        </Box>
        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
          {isUser ? T.mb_you : T.mb_sage}
        </Typography>
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '78%',
          px: 2,
          py: 1.5,
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isDark
            ? (isUser ? '#1B3929' : '#1C2128')
            : (isUser ? '#DCFCE7' : '#F9FAFB'),
          border: `1px solid ${isDark
            ? (isUser ? '#2D6A4F' : theme.palette.divider)
            : (isUser ? '#86EFAC' : '#E5E7EB')}`,
        }}
      >
        {message.isStreaming && message.content === '' ? (
          <LoadingDots />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
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

      {/* Sources + feedback row */}
      {!isUser && !message.isStreaming && (
        <Box sx={{ maxWidth: '78%', width: '100%' }}>
          <SourcesPanel sources={message.sources} />

          {showFeedback && (
            <Box display="flex" gap={0.5} mt={0.5} ml={0.5}>
              <Tooltip title={T.mb_thumbup}>
                <IconButton
                  size="small"
                  onClick={() => onFeedback(message.id, 'up')}
                  sx={{
                    p: 0.5,
                    color: message.feedback === 'up' ? '#16A34A' : '#9CA3AF',
                    '&:hover': { color: '#16A34A' },
                  }}
                >
                  <ThumbUpAltIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={T.mb_thumbdown}>
                <IconButton
                  size="small"
                  onClick={() => onFeedback(message.id, 'down')}
                  sx={{
                    p: 0.5,
                    color: message.feedback === 'down' ? '#DC2626' : '#9CA3AF',
                    '&:hover': { color: '#DC2626' },
                  }}
                >
                  <ThumbDownAltIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
