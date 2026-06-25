import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import type { SvgIconComponent } from '@mui/icons-material';

const STEPS: {
  Icon: SvgIconComponent; step: string; title: string; body: string; color: string;
}[] = [
  {
    Icon: TravelExploreIcon,
    step: '01',
    title: 'Pregunta sobre España',
    body: '¿Qué destinos están saturados en agosto? ¿Dónde aplica Horizon bonificaciones? ¿Cómo compara Barcelona con Donostia?',
    color: '#4ADE80',
  },
  {
    Icon: SearchIcon,
    step: '02',
    title: 'Recuperación Semántica',
    body: 'ChromaDB convierte tu consulta en un vector y recupera los 5 documentos más relevantes — datos reales de congestión, sostenibilidad y reservas.',
    color: '#34D399',
  },
  {
    Icon: AutoAwesomeIcon,
    step: '03',
    title: 'Claude Lee los Datos',
    body: 'El modelo recibe esos documentos y responde únicamente desde ellos. Sin invención — solo INE, FRONTUR y Horizon.',
    color: '#6EE7B7',
  },
  {
    Icon: FactCheckIcon,
    step: '04',
    title: 'Respuesta + Fuentes',
    body: 'Cada respuesta se transmite token a token. Debajo encontrarás los documentos fuente y sus puntuaciones de relevancia.',
    color: '#A7F3D0',
  },
];

export default function HowItWorksSection() {
  return (
    <Box
      component="section"
      id="how"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Single background photo — Barcelona aerial */}
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(/stat-destinos.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        filter: 'saturate(0.75) brightness(0.85)',
        transform: 'scale(1.04)',
      }} />

      {/* Dark overlay with fade-out on all edges */}
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(180deg, #0D1F14 0%, rgba(13,31,20,0.50) 22%, rgba(13,31,20,0.50) 78%, #0D1F14 100%),
          linear-gradient(90deg,  rgba(13,31,20,0.70) 0%, rgba(13,31,20,0.10) 18%, rgba(13,31,20,0.10) 82%, rgba(13,31,20,0.70) 100%)
        `,
      }} />

      <Box maxWidth={1100} mx="auto" position="relative" zIndex={2}>

        {/* Heading */}
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" sx={{ color: '#4ADE80', letterSpacing: 3, fontSize: '0.72rem', fontWeight: 700 }}>
            Cómo Funciona
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={0.5} sx={{ color: '#FFFFFF' }}>
            Cuatro pasos, datos reales, cero invención
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF', mt: 1.5, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Un pipeline RAG que recupera datos reales de destinos españoles,
            fundamenta cada respuesta y la transmite en tiempo real.
          </Typography>
        </Box>

        {/* Connector line + cards */}
        <Box sx={{ position: 'relative' }}>

          {/* Horizontal connector line (desktop only) */}
          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 28,
              left: '12.5%',
              right: '12.5%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.40) 20%, rgba(74,222,128,0.40) 80%, transparent)',
              zIndex: 0,
            }}
          />

          <Box display="flex" flexWrap="wrap" gap={{ xs: 3, md: 2.5 }} justifyContent="center">
            {STEPS.map(({ Icon, step, title, body, color }) => (
              <Box
                key={step}
                flex="1 1 200px"
                maxWidth={260}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'transform 0.25s',
                  '&:hover': { transform: 'translateY(-6px)' },
                }}
              >
                {/* Step circle */}
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}55 0%, ${color}18 70%)`,
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 3,
                    boxShadow: `0 0 12px ${color}, 0 0 30px ${color}88, 0 0 60px ${color}33`,
                    position: 'relative',
                  }}
                >
                  <Icon sx={{ fontSize: 24, color, filter: `drop-shadow(0 0 6px ${color})` }} />
                  <Box
                    sx={{
                      position: 'absolute', top: -6, right: -6,
                      width: 20, height: 20, borderRadius: '50%',
                      bgcolor: color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: '#052E16', lineHeight: 1 }}>
                      {step}
                    </Typography>
                  </Box>
                </Box>

                {/* Card body with city photo inside */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    border: `1px solid ${color}40`,
                    width: '100%',
                    flex: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#FFFFFF',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.28), inset 0 6px 28px ${color}90`,
                  }}
                >
                  {/* Colored top line */}
                  <Box sx={{ height: '3px', width: 32, borderRadius: '2px', bgcolor: color, mb: 1.5, position: 'relative', zIndex: 1, boxShadow: `0 2px 8px ${color}88` }} />

                  <Typography variant="subtitle1" fontWeight={700} mb={1} sx={{ color: '#111827', position: 'relative', zIndex: 1 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
                    {body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
