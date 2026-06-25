import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import type { SxProps } from '@mui/material';
import type { ReactNode } from 'react';

const STEPS = [
  {
    icon: <TravelExploreIcon sx={{ fontSize: 28, color: '#38BDF8' }} />,
    step: '01',
    title: 'Ask about Spain',
    body: "Ask in natural language: which destinations are over-saturated in August, where Horizon applies sustainability bonuses, or how Barcelona compares to Donostia.",
    accent: '#38BDF8',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 28, color: '#818CF8' }} />,
    step: '02',
    title: 'Semantic Retrieval',
    body: 'ChromaDB converts your query to a vector and retrieves the 5 most relevant destination documents — real congestion, sustainability, and booking data.',
    accent: '#818CF8',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: '#FBbf24' }} />,
    step: '03',
    title: 'Claude Reads Only the Data',
    body: 'Claude Haiku receives those documents and answers exclusively from them. No invented figures — only what INE, FRONTUR, and Horizon actually say.',
    accent: '#FBbf24',
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 28, color: '#10B981' }} />,
    step: '04',
    title: 'Grounded Answer + Sources',
    body: 'Every answer streams token by token. Collapse the sources panel to see which destinations and documents backed the response, with relevance scores.',
    accent: '#10B981',
  },
];

function StepCard({
  icon, step, title, body, accent, index,
}: {
  icon: ReactNode; step: string; title: string; body: string; accent: string; index: number;
}) {
  const sx: SxProps = {
    flex: '1 1 220px',
    p: 3,
    borderRadius: '16px',
    background: 'rgba(255,255,255,.025)',
    border: `1px solid ${accent}20`,
    backdropFilter: 'blur(12px)',
    transition: 'border-color .2s, background .2s, transform .2s',
    '&:hover': {
      background: `${accent}08`,
      borderColor: `${accent}45`,
      transform: 'translateY(-2px)',
    },
  };

  return (
    <Box sx={sx}>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: `${accent}50`, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {step}
        </Typography>
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={700} mb={0.75} sx={{ color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
        {body}
      </Typography>
    </Box>
  );
}

export default function HowItWorksSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #0A1020 0%, #070C16 100%)',
      }}
    >
      <Box maxWidth={1100} mx="auto">
        <Box textAlign="center" mb={6}>
          <Typography variant="overline" sx={{ color: '#FBbf24', letterSpacing: 3, fontSize: '0.72rem', fontWeight: 600 }}>
            Under the Hood
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={1} sx={{ color: 'text.primary' }}>
            How Sage Answers Your Questions
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            A four-step RAG pipeline that retrieves Spain's real destination data,
            grounds every answer in it, and streams the response in real time.
          </Typography>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2}>
          {STEPS.map((step, i) => (
            <StepCard key={step.title} {...step} index={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
