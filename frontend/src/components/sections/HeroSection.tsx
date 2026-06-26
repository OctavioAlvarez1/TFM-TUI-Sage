import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';

export default function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const { lang } = useApp();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const T = translations[lang];

  const EXAMPLES = [T.hero_example_1, T.hero_example_2, T.hero_example_3];

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSearch(query.trim());
    setQuery('');
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 520, md: 620 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background image with directional overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/spain-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'linear-gradient(90deg, rgba(13,17,23,1.0) 0%, rgba(13,17,23,1.0) 28%, rgba(13,17,23,0.72) 46%, rgba(13,17,23,0) 70%)'
              : 'linear-gradient(90deg, rgba(255,255,255,1.0) 0%, rgba(255,255,255,1.0) 28%, rgba(255,255,255,0.72) 46%, rgba(255,255,255,0) 70%)',
          },
        }}
      />

      {/* Decorative leaf accent (left edge) */}
      <Box
        sx={{
          position: 'absolute',
          left: -20,
          bottom: 0,
          width: 180,
          height: 320,
          background: 'radial-gradient(ellipse at 0% 100%, rgba(22,163,74,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1100,
          mx: 'auto',
          px: { xs: 3, md: 6 },
          py: { xs: 8, md: 10 },
          width: '100%',
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: '54%' } }}>
          {/* Badge */}
          <Chip
            label={T.hero_badge}
            size="small"
            sx={{
              mb: 3,
              bgcolor: '#16A34A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.64rem',
              letterSpacing: 1,
            }}
          />

          {/* Heading line 1 */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.6rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              color: theme.palette.text.primary,
              mb: 0.25,
              textShadow: isDark ? 'none' : '0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {T.hero_h1_line1}
          </Typography>

          {/* Heading line 2 — cursive accent */}
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.6rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              mb: 2.5,
              textShadow: isDark ? 'none' : '0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {T.hero_h1_line2_pre}{' '}
            <Box
              component="span"
              sx={{
                fontFamily: '"Dancing Script", cursive',
                fontWeight: 700,
                fontSize: { xs: '2.9rem', md: '4.2rem' },
                color: '#16A34A',
                textShadow: 'none',
              }}
            >
              {T.hero_h1_line2_cursive}
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              lineHeight: 1.7,
              maxWidth: 440,
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 500,
            }}
          >
            {T.hero_subtitle}
          </Typography>

          {/* Search bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: '50px',
              border: '2px solid #16A34A',
              boxShadow: isDark
                ? '0 4px 20px rgba(22,163,74,0.22), 0 2px 8px rgba(0,0,0,0.30)'
                : '0 4px 20px rgba(22,163,74,0.18), 0 2px 8px rgba(0,0,0,0.08)',
              px: 2.5,
              py: 0.5,
              mb: 2,
              maxWidth: 600,
            }}
          >
            <InputBase
              fullWidth
              placeholder={T.hero_placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              sx={{
                fontSize: '0.93rem',
                color: theme.palette.text.primary,
                '& input::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
              }}
            />
            <IconButton
              onClick={handleSubmit}
              sx={{
                bgcolor: '#16A34A',
                color: '#FFFFFF',
                width: 36,
                height: 36,
                ml: 1,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(22,163,74,0.5)',
                '&:hover': { bgcolor: '#15803D' },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Example chips */}
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
              {T.hero_examples_label}
            </Typography>
            {EXAMPLES.map((ex) => (
              <Chip
                key={ex}
                label={ex}
                size="small"
                onClick={() => onSearch(ex)}
                sx={{
                  bgcolor: isDark ? 'rgba(22,27,34,0.85)' : 'rgba(255,255,255,0.95)',
                  color: theme.palette.text.primary,
                  border: `1px solid ${isDark ? '#2D6A4F' : '#BBF7D0'}`,
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': { bgcolor: isDark ? 'rgba(22,163,74,0.15)' : '#F0FDF4', borderColor: '#4ADE80' },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
