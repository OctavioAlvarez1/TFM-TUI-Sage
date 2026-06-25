import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { SourceDocument } from '../../types/chat';

interface Props {
  sources: SourceDocument[];
}

export default function SourcesPanel({ sources }: Props) {
  if (sources.length === 0) return null;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        mt: 1.5,
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '10px !important',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Sources · {sources.length} document{sources.length !== 1 ? 's' : ''} retrieved
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {sources.map((src, i) => (
            <Box key={i} sx={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,.06)' : 'none', pt: i > 0 ? 1.5 : 0 }}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Chip
                  label={src.destination_name}
                  size="small"
                  sx={{ color: 'primary.main', bgcolor: 'rgba(16,185,129,.1)', fontWeight: 600, fontSize: '0.7rem' }}
                />
                <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 500 }}>
                  {(src.relevance * 100).toFixed(0)}% relevance
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, display: 'block' }}>
                {src.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
