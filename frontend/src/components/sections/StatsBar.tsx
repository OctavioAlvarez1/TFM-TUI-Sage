import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import type { SvgIconComponent } from '@mui/icons-material';

const STATS: { value: string; label: string; sub: string; Icon: SvgIconComponent }[] = [
  { value: '20',   label: 'Destinos',           sub: 'Playas · Ciudades · Naturaleza · Mixto', Icon: LocalFloristIcon },
  { value: '85%',  label: 'Concentración',       sub: 'en el 10% del territorio',               Icon: BarChartIcon     },
  { value: '240+', label: 'Datos mensuales',     sub: 'INE · 13 provincias',                    Icon: TrendingUpIcon   },
  { value: '21',   label: 'Documentos RAG',      sub: 'Contexto + fuentes',                     Icon: DescriptionIcon  },
];

export default function StatsBar() {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #F3F4F6',
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 4 },
        boxShadow: '0 1px 0 #F3F4F6',
      }}
    >
      <Box
        maxWidth={1100}
        mx="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#F3F4F6', display: { xs: 'none', md: 'block' } }}
          />
        }
      >
        {STATS.map(({ value, label, sub, Icon }) => (
          <Box key={label} flex="1 1 180px" textAlign="center" px={3} py={{ xs: 2, md: 0 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
              <Icon sx={{ fontSize: 20, color: '#9CA3AF' }} />
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, color: '#111827', lineHeight: 1 }}
              >
                {value}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#111827', mb: 0.25 }}>
              {label}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
              {sub}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
