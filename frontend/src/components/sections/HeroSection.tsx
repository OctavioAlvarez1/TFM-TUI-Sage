import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// 20 real destinations from the dataset, with type-based colours
const DESTINATIONS = [
  { name: 'Barcelona', color: '#818CF8' },
  { name: 'Donostia-San Sebastián', color: '#818CF8' },
  { name: 'Costa Brava', color: '#38BDF8' },
  { name: 'Mallorca', color: '#38BDF8' },
  { name: 'Madrid', color: '#818CF8' },
  { name: 'Rías Baixas', color: '#38BDF8' },
  { name: 'Granada', color: '#818CF8' },
  { name: 'Tenerife', color: '#38BDF8' },
  { name: 'Picos de Europa', color: '#34D399' },
  { name: 'Ibiza', color: '#38BDF8' },
  { name: 'Sevilla', color: '#818CF8' },
  { name: 'Sierra Nevada', color: '#34D399' },
];

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 12, md: 16 },
        pb: { xs: 12, md: 18 },
        background: 'linear-gradient(160deg, #050A14 0%, #0D1B2A 100%)',
        textAlign: 'center',
      }}
    >
      {/* Warm Mediterranean glow — golden left, sea-blue right */}
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse at 25% 70%, rgba(251,191,36,.07), transparent 50%)',
          'radial-gradient(ellipse at 75% 30%, rgba(14,165,233,.06), transparent 50%)',
          'radial-gradient(circle at 50% 50%, rgba(16,185,129,.04), transparent 60%)',
        ].join(','),
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>

        {/* Badge */}
        <Chip
          label="TUI Care Foundation · Future Shapers Spain · UCM TFM 2026"
          size="small"
          sx={{
            mb: 4,
            bgcolor: 'rgba(251,191,36,.1)',
            color: '#FBbf24',
            border: '1px solid rgba(251,191,36,.25)',
            fontWeight: 500,
            fontSize: '0.7rem',
            letterSpacing: 0.3,
          }}
        />

        {/* Main title */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <AutoAwesomeIcon sx={{ fontSize: { xs: 28, md: 36 }, color: '#FBbf24' }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 800,
              letterSpacing: { xs: 8, md: 14 },
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            SAGE
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{ color: '#94A3B8', fontWeight: 400, mb: 3, fontSize: { xs: '1rem', md: '1.2rem' } }}
        >
          Spain Tourism Intelligence Platform
        </Typography>

        {/* Hero stat — the core problem */}
        <Box
          sx={{
            display: 'inline-block',
            px: { xs: 3, md: 5 },
            py: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: '16px',
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.09)',
            backdropFilter: 'blur(12px)',
            maxWidth: 560,
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              background: 'linear-gradient(90deg, #FBbf24, #EA580C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            85% of tourists
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
            concentrate in just&nbsp;
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              10% of Spain's destinations
            </Box>
            . Ask Sage what the data says — and where the real opportunities are.
          </Typography>
        </Box>

        {/* Destination chips */}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1} mb={2}>
          {DESTINATIONS.map(({ name, color }) => (
            <Chip
              key={name}
              label={name}
              size="small"
              sx={{
                bgcolor: `${color}12`,
                color: color,
                border: `1px solid ${color}30`,
                fontWeight: 500,
                fontSize: '0.72rem',
              }}
            />
          ))}
          <Chip
            label="+ 8 more"
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,.04)', color: '#64748B', border: '1px solid rgba(255,255,255,.07)', fontSize: '0.72rem' }}
          />
        </Box>

        <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
          🏖 Beach &nbsp;·&nbsp; 🏛 City &nbsp;·&nbsp; 🌿 Nature &nbsp;·&nbsp; Data: INE EOH · FRONTUR · AEMET
        </Typography>
      </Box>

      {/* SVG wave divider */}
      <Box
        component="svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: { xs: 40, md: 80 }, display: 'block',
        }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#070C16" />
      </Box>
    </Box>
  );
}
