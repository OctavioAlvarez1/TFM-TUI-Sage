import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import type { ReactNode } from 'react';

const STEPS = [
  {
    icon: <TravelExploreIcon sx={{ fontSize: 32, color: '#0369A1' }} />,
    step: '01',
    title: 'Pregunta sobre España',
    body: "¿Qué destinos están saturados en agosto? ¿Dónde aplica Horizon bonificaciones de sostenibilidad? ¿Cómo compara Barcelona con Donostia?",
    accent: '#0369A1',
    bg: '#E0F2FE',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 32, color: '#C2410C' }} />,
    step: '02',
    title: 'Recuperación Semántica',
    body: 'ChromaDB convierte tu consulta en un vector y recupera los 5 documentos de destino más relevantes — datos reales de congestión, sostenibilidad y reservas.',
    accent: '#C2410C',
    bg: '#FFF7ED',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: '#D97706' }} />,
    step: '03',
    title: 'Claude Lee Solo los Datos',
    body: 'Claude Haiku recibe esos documentos y responde únicamente desde ellos. Sin datos inventados — solo lo que dicen el INE, FRONTUR y Horizon.',
    accent: '#D97706',
    bg: '#FEFCE8',
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 32, color: '#65A30D' }} />,
    step: '04',
    title: 'Respuesta + Fuentes',
    body: 'Cada respuesta se transmite token a token. Debajo encontrarás los documentos fuente y sus puntuaciones de relevancia para verificar el razonamiento.',
    accent: '#65A30D',
    bg: '#F0FDF4',
  },
];

function StepCard({ icon, step, title, body, accent, bg }: {
  icon: ReactNode; step: string; title: string; body: string; accent: string; bg: string;
}) {
  return (
    <Box
      flex="1 1 220px"
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: bg,
        border: `1px solid ${accent}25`,
        transition: 'transform .2s, box-shadow .2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 32px ${accent}18` },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: `${accent}50`, lineHeight: 1 }}>
          {step}
        </Typography>
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={700} mb={0.75} sx={{ color: '#1C1917' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#78716C', lineHeight: 1.7 }}>
        {body}
      </Typography>
    </Box>
  );
}

export default function HowItWorksSection() {
  return (
    <Box
      component="section"
      id="how"
      sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 }, bgcolor: '#FFFBF5' }}
    >
      <Box maxWidth={1100} mx="auto">
        <Box textAlign="center" mb={6}>
          <Typography variant="overline" sx={{ color: '#D97706', letterSpacing: 3, fontSize: '0.72rem', fontWeight: 700 }}>
            Cómo Funciona
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={0.5} sx={{ color: '#1C1917' }}>
            Cuatro pasos, datos reales, cero invención
          </Typography>
          <Typography variant="body1" sx={{ color: '#78716C', mt: 1.5, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Un pipeline RAG que recupera datos reales de destinos españoles,
            fundamenta cada respuesta y la transmite en tiempo real.
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {STEPS.map((step) => <StepCard key={step.title} {...step} />)}
        </Box>
      </Box>
    </Box>
  );
}
