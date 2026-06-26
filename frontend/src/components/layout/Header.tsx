import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SpaIcon from '@mui/icons-material/Spa';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';

export default function Header() {
  const { mode, toggleMode, lang, toggleLang } = useApp();
  const theme = useTheme();
  const isDark = mode === 'dark';
  const T = translations[lang];

  const NAV_LINKS = [
    { label: T.nav_destinos, href: '#chat' },
    { label: T.nav_como,     href: '#how' },
    { label: T.nav_suite,    href: '#footer' },
  ];

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: isDark
          ? 'linear-gradient(105deg, #0d2818 0%, #0f1f14 45%, #0d1117 100%)'
          : 'linear-gradient(105deg, #dcfce7 0%, #f0fdf4 45%, #ffffff 100%)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? '#1B3929' : '#D1FAE5'}`,
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.40), 0 1px 0 #1B3929'
          : '0 4px 20px rgba(22,163,74,0.10), 0 1px 0 #BBF7D0',
        overflow: 'hidden',
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

        {/* Wind streaks */}
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

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.2} sx={{ cursor: 'default', userSelect: 'none' }}>
          <Box
            sx={{
              width: 36, height: 36,
              borderRadius: '12px 4px 12px 4px',
              background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(22,163,74,0.40)',
              flexShrink: 0,
            }}
          >
            <SpaIcon sx={{ color: '#fff', fontSize: 19 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={900} letterSpacing={5} sx={{ lineHeight: 1, fontSize: '1.1rem' }}>
              <Box component="span" sx={{ color: '#16A34A', fontWeight: 900 }}>S</Box>
              <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>AGE</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, fontSize: '0.58rem', letterSpacing: 1.5, lineHeight: 1 }}>
              SPAIN TOURISM INTELLIGENCE
            </Typography>
          </Box>
        </Box>

        <Box flex={1} />

        {/* Nav links */}
        <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={0.5} mr={2}>
          {NAV_LINKS.map(({ label, href }) => (
            <Button
              key={label}
              onClick={() => scrollTo(href)}
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'none',
                px: 1.5,
                borderRadius: '8px',
                '&:hover': { color: '#16A34A', bgcolor: isDark ? 'rgba(22,163,74,0.10)' : '#F0FDF4' },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Lang toggle */}
        <Tooltip title={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}>
          <Button
            onClick={toggleLang}
            size="small"
            sx={{
              minWidth: 0,
              px: 1,
              py: 0.4,
              mr: 0.5,
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              textTransform: 'none',
              '&:hover': { borderColor: '#16A34A', bgcolor: isDark ? 'rgba(22,163,74,0.10)' : '#F0FDF4' },
            }}
          >
            <Box
              component="img"
              src={lang === 'es'
                ? 'https://flagcdn.com/w40/us.png'
                : 'https://flagcdn.com/w40/es.png'}
              alt={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              sx={{ width: 22, height: 'auto', display: 'block', borderRadius: '2px' }}
            />
          </Button>
        </Tooltip>

        {/* Dark mode toggle */}
        <Tooltip title={isDark ? (lang === 'es' ? 'Modo claro' : 'Light mode') : (lang === 'es' ? 'Modo oscuro' : 'Dark mode')}>
          <IconButton
            onClick={toggleMode}
            size="small"
            sx={{
              mr: 1.5,
              color: theme.palette.text.secondary,
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              borderRadius: '8px',
              width: 32,
              height: 32,
              '&:hover': { color: '#16A34A', borderColor: '#16A34A', bgcolor: isDark ? 'rgba(22,163,74,0.10)' : '#F0FDF4' },
            }}
          >
            {isDark ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>

        {/* CTA */}
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
          {T.header_cta}
        </Button>

      </Toolbar>
    </AppBar>
  );
}
