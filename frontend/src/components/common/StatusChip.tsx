import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import type { StatusResponse } from '../../types/chat';

interface Props {
  status: StatusResponse | null;
  loading: boolean;
}

export default function StatusChip({ status, loading }: Props) {
  if (loading) {
    return (
      <Chip
        icon={<CircularProgress size={12} sx={{ color: 'text.secondary' }} />}
        label="Connecting..."
        size="small"
        sx={{ bgcolor: 'rgba(255,255,255,.06)', color: 'text.secondary' }}
      />
    );
  }

  const configs = {
    ready: { label: `KB Ready · ${status?.document_count ?? 0} docs`, color: '#10B981' },
    kb_missing: { label: 'Building KB...', color: '#F59E0B' },
    api_key_missing: { label: 'API Key Missing', color: '#EF4444' },
    error: { label: 'Connection Error', color: '#EF4444' },
  };

  const key = status?.status ?? 'error';
  const cfg = configs[key as keyof typeof configs] ?? configs.error;

  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: `${cfg.color}18`,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        fontWeight: 500,
        fontSize: '0.7rem',
      }}
    />
  );
}
