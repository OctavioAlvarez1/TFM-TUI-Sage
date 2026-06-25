import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import StatusChip from '../common/StatusChip';
import { useKbStatus } from '../../hooks/useKbStatus';

const EXAMPLE_QUESTIONS = [
  'What is the most sustainable destination in Spain?',
  'Which destinations have critical congestion in summer?',
  'Where does Horizon apply a redistribution penalty?',
  'What beach destinations have a sustainability bonus?',
  'Compare Barcelona and Donostia-San Sebastián sustainability.',
];

const HOW_IT_WORKS = [
  'Your question is converted to a vector embedding',
  'ChromaDB retrieves the 5 most relevant destination docs',
  'Claude reads those docs and answers only from them',
  'Sources and relevance scores are shown below each answer',
];

interface Props {
  onExampleClick: (question: string) => void;
}

export default function StatusSidebar({ onExampleClick }: Props) {
  const { status, loading } = useKbStatus();

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 2.5,
        p: 2.5,
        borderRight: '1px solid rgba(255,255,255,.07)',
        overflowY: 'auto',
      }}
    >
      {/* Status */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
          System Status
        </Typography>
        <Box mt={0.75}>
          <StatusChip status={status} loading={loading} />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />

      {/* Example questions */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
          Example Questions
        </Typography>
        <Box mt={1} display="flex" flexDirection="column" gap={0.75}>
          {EXAMPLE_QUESTIONS.map((q) => (
            <Button
              key={q}
              onClick={() => onExampleClick(q)}
              variant="text"
              size="small"
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                color: 'text.secondary',
                fontSize: '0.72rem',
                lineHeight: 1.4,
                py: 0.75,
                px: 1,
                borderRadius: '8px',
                border: '1px solid transparent',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(16,185,129,.06)',
                  border: '1px solid rgba(16,185,129,.15)',
                },
              }}
            >
              {q}
            </Button>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />

      {/* How it works */}
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          background: 'rgba(255,255,255,.03)',
          border: '1px solid rgba(255,255,255,.07)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
          How Sage Works
        </Typography>
        <Box mt={1} display="flex" flexDirection="column" gap={1}>
          {HOW_IT_WORKS.map((step, i) => (
            <Box key={i} display="flex" gap={1} alignItems="flex-start">
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  minWidth: 16,
                  mt: 0.1,
                }}
              >
                {i + 1}.
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
