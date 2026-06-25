import { useState, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

interface Props {
  onSend: (question: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const q = value.trim();
    if (!q || disabled) return;
    onSend(q);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid rgba(255,255,255,.07)',
        background: 'rgba(7,12,22,.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box display="flex" gap={1} alignItems="flex-end">
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask about destinations, sustainability, congestion..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: 'rgba(255,255,255,.04)',
              '& fieldset': { borderColor: 'rgba(255,255,255,.12)' },
              '&:hover fieldset': { borderColor: 'rgba(16,185,129,.4)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <IconButton
          onClick={submit}
          disabled={!value.trim() || disabled}
          sx={{
            bgcolor: 'primary.main',
            color: '#070C16',
            borderRadius: '10px',
            width: 40,
            height: 40,
            flexShrink: 0,
            '&:hover': { bgcolor: '#34D399' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,.08)', color: 'text.secondary' },
          }}
        >
          <ArrowUpwardRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box mt={0.75} display="flex" justifyContent="center">
        <Box
          component="span"
          sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.6 }}
        >
          Enter to send · Shift+Enter for new line · Answers grounded in TUI destination data
        </Box>
      </Box>
    </Box>
  );
}
