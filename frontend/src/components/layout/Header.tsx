import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SpaIcon from '@mui/icons-material/Spa';

const NAV_LINKS = [
  { label: 'Destinos', href: '#chat' },
  { label: 'Cómo funciona', href: '#how' },
  { label: 'Suite TUI', href: '#footer' },
];

export default function Header() {
  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(105deg, #dcfce7 0%, #f0fdf4 45%, #ffffff 100%)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #D1FAE5',
        boxShadow: '0 4px 20px rgba(22,163,74,0.10), 0 1px 0 #BBF7D0',
        overflow: 'hidden',
        // Green accent line at top
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #16A34A 0%, #4ADE80 50%, #16A34A 100%)',
          zIndex: 2,
        },
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 5 }, minHeight: { xs: 56, md: 64 }, position: 'relative' }}>

        {/* Wind streaks — animated lines crossing left to right */}
        {([
          { width: 80,  top: '28%', delay: '0s',   dur: '5s',   opacity: 0.18 },
          { width: 120, top: '60%', delay: '1.8s', dur: '6.5s', opacity: 0.11 },
          { width: 50,  top: '45%', delay: '3.4s', dur: '4.2s', opacity: 0.15 },
          { width: 95,  top: '15%', delay: '5s',   dur: '7s',   opacity: 0.08 },
        ] as const).map((s, i) => (
          <Box
            key={i}
            aria-hidden
            sx={{
              position: 'absolute',
              left: 0,
              top: s.top,
              height: '1.5px',
              width: s.width,
              borderRadius: '2px',
              background: `linear-gradient(90deg, transparent, rgba(22,163,74,${s.opacity}), transparent)`,
              pointerEvents: 'none',
              zIndex: 0,
              animation: `windStreak${i} ${s.dur} ${s.delay} infinite linear`,
              [`@keyframes windStreak${i}`]: {
                '0%':   { transform: 'translateX(-120px)', opacity: 0 },
                '8%':   { opacity: 1 },
                '92%':  { opacity: 1 },
                '100%': { transform: 'translateX(calc(100vw + 120px))', opacity: 0 },
              },
            }}
          />
        ))}

        {/* ── Logo ── */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.2}
          sx={{ cursor: 'default', userSelect: 'none' }}
        >
          {/* Organic leaf badge */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '12px 4px 12px 4px',   // organic asymmetric shape
              background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(22,163,74,0.40)',
              flexShrink: 0,
            }}
          >
            <SpaIcon sx={{ color: '#fff', fontSize: 19 }} />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={900}
              letterSpacing={5}
              sx={{ lineHeight: 1, fontSize: '1.1rem' }}
            >
              <Box component="span" sx={{ color: '#16A34A', fontWeight: 900 }}>S</Box>
              <Box component="span" sx={{ color: '#374151', fontWeight: 600 }}>AGE</Box>
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#4B5563', fontWeight: 600, fontSize: '0.58rem', letterSpacing: 1.5, lineHeight: 1 }}
            >
              SPAIN TOURISM INTELLIGENCE
            </Typography>
          </Box>
        </Box>

        <Box flex={1} />

        {/* ── Nav links ── */}
        <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={0.5} mr={3}>
          {NAV_LINKS.map(({ label, href }) => (
            <Button
              key={label}
              onClick={() => scrollTo(href)}
              sx={{
                color: '#4B5563',
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'none',
                px: 1.5,
                borderRadius: '8px',
                '&:hover': { color: '#16A34A', bgcolor: '#F0FDF4' },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* ── CTA ── */}
        <Button
          onClick={() => scrollTo('chat')}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: '#16A34A',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            borderRadius: '50px',
            px: 2.5,
            py: 0.9,
            boxShadow: '0 2px 10px rgba(22,163,74,0.35)',
            '&:hover': { bgcolor: '#15803D', boxShadow: '0 4px 14px rgba(22,163,74,0.45)' },
          }}
        >
          Pregunta a Sage →
        </Button>

      </Toolbar>
    </AppBar>
  );
}
