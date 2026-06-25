import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const STATS = [
  { value: '20', label: 'Spanish Destinations', sub: 'Beach · City · Nature · Mixed' },
  { value: '85%', label: 'Tourist Concentration', sub: 'in only 10% of territory' },
  { value: '240+', label: 'Monthly Data Points', sub: 'INE EOH — 13 provinces' },
  { value: '21', label: 'RAG Documents', sub: '20 destinations + suite context' },
];

export default function StatsBar() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #070C16 0%, #0A1020 100%)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        py: 4,
        px: { xs: 2, md: 4 },
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
            sx={{ borderColor: 'rgba(255,255,255,.07)', display: { xs: 'none', md: 'block' } }}
          />
        }
      >
        {STATS.map(({ value, label, sub }) => (
          <Box
            key={label}
            flex="1 1 180px"
            textAlign="center"
            px={3}
            py={{ xs: 2, md: 0 }}
          >
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                background: 'linear-gradient(135deg, #10B981, #34D399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', mb: 0.25 }}>
              {label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
              {sub}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
