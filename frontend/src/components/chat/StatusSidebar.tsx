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
        borderRight: '1.5px solid #D1FAE5',
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #F0FDF4 0%, #FAFFFE 100%)',
      }}
    >
      {/* Sage branding header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2,
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)',
          borderBottom: '1px solid #D1FAE5',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.2} mb={1}>
          <Box
            sx={{
              width: 32, height: 32,
              borderRadius: '10px 3px 10px 3px',
              background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(22,163,74,0.35)',
            }}
          >
            <SpaIcon sx={{ color: '#fff', fontSize: 17 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#111827', lineHeight: 1 }}>
              <Box component="span" sx={{ color: '#16A34A' }}>S</Box>AGE
            </Typography>
            <Typography sx={{ fontSize: '0.58rem', color: '#6B7280', fontWeight: 600, letterSpacing: 1 }}>
              RAG · SPAIN TOURISM
            </Typography>
          </Box>
        </Box>
        <Box mt={0.5}>
          <StatusChip status={status} loading={loading} />
        </Box>
      </Box>

      {/* Content area */}
      <Box display="flex" flexDirection="column" gap={2.5} p={2.5} flex={1}>
        {/* Example questions */}
        <Box>
          <Typography variant="overline" sx={{ color: '#9CA3AF', fontSize: '0.62rem', letterSpacing: 1.5, fontWeight: 700 }}>
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
                  color: '#374151',
                  fontSize: '0.72rem',
                  lineHeight: 1.4,
                  py: 0.75,
                  px: 1,
                  borderRadius: '8px',
                  border: '1px solid transparent',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#15803D',
                    bgcolor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                  },
                }}
              >
                {q}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#D1FAE5' }} />

        {/* How it works */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #D1FAE5',
            boxShadow: '0 2px 8px rgba(22,163,74,0.06)',
          }}
        >
          <Typography variant="overline" sx={{ color: '#9CA3AF', fontSize: '0.62rem', letterSpacing: 1.5, fontWeight: 700 }}>
            Cómo funciona
          </Typography>
          <Box mt={1} display="flex" flexDirection="column" gap={1.2}>
            {HOW_IT_WORKS.map((step, i) => (
              <Box key={i} display="flex" gap={1} alignItems="flex-start">
                <Box
                  sx={{
                    width: 18, height: 18, borderRadius: '50%',
                    bgcolor: '#DCFCE7', border: '1px solid #86EFAC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.05,
                  }}
                >
                  <Typography sx={{ color: '#16A34A', fontWeight: 800, fontSize: '0.58rem', lineHeight: 1 }}>
                    {i + 1}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', lineHeight: 1.5 }}>
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
