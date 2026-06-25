import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const SUITE = [
  { name: 'Horizon',    reto: 2, role: 'Recomendador IA',        port: '8000/5173' },
  { name: 'Atlas',      reto: 3, role: 'Dashboard Geoespacial',  port: '8501'      },
  { name: 'Sentinel',   reto: 1, role: 'Monitor de Sentimiento', port: '8502'      },
  { name: 'Pathfinder', reto: 4, role: 'Movilidad Sostenible',   port: '8503'      },
  { name: 'Sage',       reto: 5, role: 'Asesor IA RAG',          port: '8504/5174', active: true },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      id="footer"
      sx={{
        py: 6,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #0D1B2A 0%, #071220 100%)',
      }}
    >
      <Box maxWidth={1100} mx="auto">
        <Typography
          variant="overline"
          sx={{ color: '#64748B', letterSpacing: 2, fontSize: '0.65rem', display: 'block', mb: 2 }}
        >
          Suite TUI Care Foundation
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
          {SUITE.map((p) => (
            <Box
              key={p.name}
              sx={{
                px: 2, py: 1,
                borderRadius: '8px',
                border: `1px solid ${p.active ? 'rgba(194,65,12,.5)' : 'rgba(255,255,255,.08)'}`,
                bgcolor: p.active ? 'rgba(194,65,12,.1)' : 'rgba(255,255,255,.03)',
              }}
            >
              <Typography variant="caption" display="block" fontWeight={700}
                sx={{ color: p.active ? '#FB923C' : '#94A3B8', lineHeight: 1.3 }}
              >
                {p.name}
                <Box component="span" sx={{ color: '#475569', fontWeight: 400, ml: 0.5 }}>
                  · Reto {p.reto}
                </Box>
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem' }}>
                {p.role} · :{p.port}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,.06)', mb: 3 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            UCM TFM 2026 · TUI Care Foundation Future Shapers Spain
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            Claude Haiku · ChromaDB · sentence-transformers · FastAPI · React
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
