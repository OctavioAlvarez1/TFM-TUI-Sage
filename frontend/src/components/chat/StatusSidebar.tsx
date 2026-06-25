import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import SpaIcon from '@mui/icons-material/Spa';
import StatusChip from '../common/StatusChip';
import { useKbStatus } from '../../hooks/useKbStatus';

const EXAMPLE_QUESTIONS = [
  '¿Cuál es el destino más sostenible de España?',
  '¿Qué destinos tienen congestión crítica en verano?',
  '¿Dónde aplica Horizon penalización por redistribución?',
  '¿Qué destinos de playa tienen bonificación de sostenibilidad?',
  'Compara la sostenibilidad de Barcelona y Donostia.',
];

const HOW_IT_WORKS = [
  'Tu pregunta se convierte en vector embedding',
  'ChromaDB recupera los 5 docs más relevantes',
  'Claude responde solo desde esos documentos',
  'Se muestran fuentes y scores de relevancia',
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
        borderRight: '1px solid rgba(255,255,255,0.07)',
        overflowY: 'auto',
        position: 'relative',
        background: 'linear-gradient(160deg, #052E16 0%, #0D2818 40%, #14532D 75%, #166534 100%)',
        backgroundAttachment: 'local',
        // Radial green glow at top-left corner
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '45%',
          background: 'radial-gradient(ellipse at 30% 0%, rgba(74,222,128,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      {/* Sage branding header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.2} mb={1.5}>
          <Box
            sx={{
              width: 34, height: 34,
              borderRadius: '10px 3px 10px 3px',
              background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22,163,74,0.45)',
            }}
          >
            <SpaIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF', lineHeight: 1 }}>
              <Box component="span" sx={{ color: '#4ADE80' }}>S</Box>AGE
            </Typography>
            <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1 }}>
              RAG · SPAIN TOURISM
            </Typography>
          </Box>
        </Box>
        <StatusChip status={status} loading={loading} />
      </Box>

      {/* Content area */}
      <Box display="flex" flexDirection="column" gap={2.5} p={2.5} flex={1} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Example questions */}
        <Box>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', letterSpacing: 1.5, fontWeight: 700 }}>
            Preguntas de ejemplo
          </Typography>
          <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <Button
                key={q}
                onClick={() => onExampleClick(q)}
                variant="text"
                size="small"
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'rgba(255,255,255,0.60)',
                  fontSize: '0.72rem',
                  lineHeight: 1.4,
                  py: 0.75,
                  px: 1,
                  borderRadius: '8px',
                  border: '1px solid transparent',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#4ADE80',
                    bgcolor: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.20)',
                  },
                }}
              >
                {q}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

        {/* How it works */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', letterSpacing: 1.5, fontWeight: 700 }}>
            Cómo funciona
          </Typography>
          <Box mt={1.2} display="flex" flexDirection="column" gap={1.2}>
            {HOW_IT_WORKS.map((step, i) => (
              <Box key={i} display="flex" gap={1} alignItems="flex-start">
                <Box
                  sx={{
                    width: 18, height: 18, borderRadius: '50%',
                    bgcolor: 'rgba(74,222,128,0.15)',
                    border: '1px solid rgba(74,222,128,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.05,
                  }}
                >
                  <Typography sx={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.58rem', lineHeight: 1 }}>
                    {i + 1}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
