import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StatusSidebar from '../chat/StatusSidebar';
import ChatWindow from '../chat/ChatWindow';
import ChatInput from '../chat/ChatInput';
import { useSageStream } from '../../hooks/useSageStream';

const CHAT_HEIGHT = 560;

export default function ChatSection() {
  const { messages, isLoading, sendMessage } = useSageStream();

  return (
    <Box
      component="section"
      id="chat"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: '#070C16',
      }}
    >
      <Box maxWidth={1100} mx="auto">
        {/* Section header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: 3, fontSize: '0.72rem', fontWeight: 600 }}
          >
            Ask Sage
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={1} sx={{ color: 'text.primary' }}>
            Your AI Destination Advisor
          </Typography>
        </Box>

        {/* Chat interface */}
        <Box
          sx={{
            display: 'flex',
            height: CHAT_HEIGHT,
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(15,26,46,.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 64px rgba(0,0,0,.4)',
          }}
        >
          <StatusSidebar onExampleClick={sendMessage} />

          <Box display="flex" flexDirection="column" flex={1} overflow="hidden">
            <ChatWindow messages={messages} />
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
