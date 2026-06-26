import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import type { SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';

const STAT_META: { value: string; Icon: SvgIconComponent; color: string; img: string }[] = [
  { value: '20',   Icon: LocalFloristIcon, color: '#4ADE80', img: '/stat-destinos.jpg'      },
  { value: '85%',  Icon: BarChartIcon,     color: '#FB923C', img: '/stat-concentracion.jpg' },
  { value: '240+', Icon: TrendingUpIcon,   color: '#A3E635', img: '/stat-datos.jpg'         },
  { value: '21',   Icon: DescriptionIcon,  color: '#34D399', img: '/stat-documentos.jpg'    },
];

export default function StatsBar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { lang } = useApp();
  const T = translations[lang];

  const LABELS = [
    { label: T.stat_destinos_label,       sub: T.stat_destinos_sub },
    { label: T.stat_concentracion_label,  sub: T.stat_concentracion_sub },
    { label: T.stat_datos_label,          sub: T.stat_datos_sub },
    { label: T.stat_documentos_label,     sub: T.stat_documentos_sub },
  ];

  const STATS = STAT_META.map((m, i) => ({ ...m, ...LABELS[i] }));

  return (
    <Box
      sx={{
        background: isDark
          ? theme.palette.background.default
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: `1px solid ${isDark ? theme.palette.divider : '#F1F5F9'}`,
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        maxWidth={1100}
        mx="auto"
        display="flex"
        flexWrap="wrap"
        gap={{ xs: 2, md: 3 }}
        justifyContent="center"
      >
        {STATS.map(({ value, label, sub, Icon, color, img }) => (
          <Box
            key={label}
            flex="1 1 200px"
            sx={{
              position: 'relative',
              minHeight: 190,
              px: 3,
              py: 2.5,
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.25s, box-shadow 0.25s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
              cursor: 'default',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '3px',
                background: color,
                borderRadius: '0 0 16px 16px',
              },
            }}
          >
            {/* Full photo background */}
            <Box aria-hidden sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }} />

            {/* Dark gradient overlay */}
            <Box aria-hidden sx={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(90deg,  rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0) 100%),
                linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.60) 100%)
              `,
              zIndex: 1,
            }} />

            {/* Icon badge */}
            <Box
              sx={{
                position: 'relative', zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36, height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.25)',
                mb: 1.5,
              }}
            >
              <Icon sx={{ fontSize: 18, color }} />
            </Box>

            {/* Number */}
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                position: 'relative', zIndex: 2,
                fontSize: { xs: '2rem', md: '2.4rem' },
                color,
                lineHeight: 1,
                mb: 0.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              {value}
            </Typography>

            {/* Label */}
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ position: 'relative', zIndex: 2, color: '#FFFFFF', mb: 0.25, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              {label}
            </Typography>

            {/* Sub */}
            <Typography
              variant="caption"
              sx={{ position: 'relative', zIndex: 2, color: 'rgba(255,255,255,0.70)' }}
            >
              {sub}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
