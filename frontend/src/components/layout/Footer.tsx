import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const SUITE = [
  { name: 'Horizon', reto: 2, role: 'AI Recommender', port: '8000/5173' },
  { name: 'Atlas', reto: 3, role: 'Geospatial Dashboard', port: '8501' },
  { name: 'Sentinel', reto: 1, role: 'Sentiment Monitor', port: '8502' },
  { name: 'Pathfinder', reto: 4, role: 'Mobility & Access', port: '8503' },
  { name: 'Sage', reto: 5, role: 'RAG AI Advisor', port: '8504/5174', active: true },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: { xs: 2, md: 4 },
        background: '#070C16',
        borderTop: '1px solid rgba(255,255,255,.06)',
      }}
    >
      <Box maxWidth={1100} mx="auto">
        {/* Suite projects */}
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', letterSpacing: 2, fontSize: '0.65rem', display: 'block', mb: 2 }}
        >
          TUI Care Foundation Suite
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
          {SUITE.map((p) => (
            <Box
              key={p.name}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: `1px solid ${p.active ? 'rgba(16,185,129,.3)' : 'rgba(255,255,255,.07)'}`,
                bgcolor: p.active ? 'rgba(16,185,129,.06)' : 'rgba(255,255,255,.02)',
              }}
            >
              <Typography
                variant="caption"
                display="block"
                fontWeight={700}
                sx={{ color: p.active ? 'primary.main' : 'text.primary', lineHeight: 1.3 }}
              >
                {p.name}
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>
                  · Reto {p.reto}
                </Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                {p.role} · :{p.port}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,.05)', mb: 3 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
            UCM TFM 2026 · TUI Care Foundation Future Shapers Spain
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
            Powered by Claude Haiku · ChromaDB · sentence-transformers
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
