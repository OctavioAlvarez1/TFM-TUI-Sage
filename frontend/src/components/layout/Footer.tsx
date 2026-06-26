import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import SpaIcon from '@mui/icons-material/Spa';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';

const STACK = ['Claude Haiku', 'ChromaDB', 'sentence-transformers', 'FastAPI', 'React 19', 'MUI v6'];

export default function Footer() {
  const { lang } = useApp();
  const T = translations[lang];

  return (
    <Box
      component="footer"
      id="footer"
      sx={{
        background: 'linear-gradient(180deg, #071A0E 0%, #030D07 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.5) 30%, rgba(74,222,128,0.5) 70%, transparent)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0, right: 0,
          width: '40%', height: '70%',
          background: 'radial-gradient(ellipse at 100% 100%, rgba(22,163,74,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box maxWidth={1100} mx="auto" px={{ xs: 2, md: 4 }} pt={7} pb={4} position="relative" zIndex={1}>

        {/* Top row: branding + suite */}
        <Box display="flex" flexWrap="wrap" gap={6} mb={6} alignItems="flex-start">

          {/* Left — Sage branding */}
          <Box flex="0 0 auto" maxWidth={280}>
            <Box display="flex" alignItems="center" gap={1.2} mb={2}>
              <Box
                sx={{
                  width: 38, height: 38,
                  borderRadius: '12px 4px 12px 4px',
                  background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(22,163,74,0.40)',
                }}
              >
                <SpaIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1 }}>
                  <Box component="span" sx={{ color: '#4ADE80' }}>S</Box>AGE
                </Typography>
                <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1.2 }}>
                  SPAIN TOURISM INTELLIGENCE
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.40)', lineHeight: 1.7, fontSize: '0.82rem' }}>
              {T.footer_tagline}
            </Typography>
            <Box mt={2.5}>
              <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1 }}>
                {T.footer_stack_label}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.75}>
                {STACK.map((t) => (
                  <Box
                    key={t}
                    sx={{
                      px: 1.2, py: 0.3,
                      borderRadius: '6px',
                      border: '1px solid rgba(74,222,128,0.18)',
                      bgcolor: 'rgba(74,222,128,0.06)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                      {t}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right — Suite */}
          <Box flex="1 1 300px">
            <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.30)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 2 }}>
              {T.footer_suite_label}
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {T.footer_suite.map((p) => (
                <Box
                  key={p.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2, py: 1.2,
                    borderRadius: '10px',
                    border: `1px solid ${p.active ? p.color + '55' : 'rgba(255,255,255,0.06)'}`,
                    bgcolor: p.active ? `${p.color}12` : 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s, background 0.2s',
                    '&:hover': {
                      borderColor: p.color + '44',
                      bgcolor: p.color + '0A',
                    },
                  }}
                >
                  {/* Color dot */}
                  <Box
                    sx={{
                      width: 8, height: 8, borderRadius: '50%',
                      bgcolor: p.color,
                      flexShrink: 0,
                      boxShadow: p.active ? `0 0 8px ${p.color}` : 'none',
                    }}
                  />
                  {/* Name */}
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: p.active ? p.color : 'rgba(255,255,255,0.55)', minWidth: 90 }}>
                    {p.name}
                    <Box component="span" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', ml: 0.75, fontSize: '0.75rem' }}>
                      Reto {p.reto}
                    </Box>
                  </Typography>
                  {/* Role */}
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.30)', flex: 1 }}>
                    {p.role}
                  </Typography>
                  {/* Active badge */}
                  {p.active && (
                    <Box sx={{ px: 1, py: 0.2, borderRadius: '20px', bgcolor: `${p.color}22`, border: `1px solid ${p.color}44` }}>
                      <Typography sx={{ fontSize: '0.6rem', color: p.color, fontWeight: 700, letterSpacing: 0.5 }}>
                        {T.footer_active}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

        {/* Bottom bar */}
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1} alignItems="center">
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
            {T.footer_copyright}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.75}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
              Sage v1.0 · Reto 5
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
