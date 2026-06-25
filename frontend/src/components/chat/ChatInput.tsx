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
        borderTop: '1px solid #E5F5EC',
        background: 'linear-gradient(180deg, #F8FFF9 0%, #FFFFFF 100%)',
      }}
    >
      <Box display="flex" gap={1} alignItems="flex-end">
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Pregunta sobre destinos, sostenibilidad, congestión..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#FFFFFF',
              color: '#111827',
              fontSize: '0.9rem',
              '& fieldset': { borderColor: '#D1FAE5', borderWidth: '1.5px' },
              '&:hover fieldset': { borderColor: '#4ADE80' },
              '&.Mui-focused fieldset': { borderColor: '#16A34A', borderWidth: '2px' },
            },
            '& textarea::placeholder': { color: '#9CA3AF', opacity: 1 },
          }}
        />
        <IconButton
          onClick={submit}
          disabled={!value.trim() || disabled}
          sx={{
            background: 'linear-gradient(145deg, #22C55E 0%, #15803D 100%)',
            color: '#FFFFFF',
            borderRadius: '12px',
            width: 42,
            height: 42,
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
            '&:hover': {
              background: 'linear-gradient(145deg, #16A34A 0%, #14532D 100%)',
              boxShadow: '0 6px 18px rgba(22,163,74,0.5)',
            },
            '&.Mui-disabled': { background: '#E5E7EB', color: '#9CA3AF', boxShadow: 'none' },
          }}
        >
          <ArrowUpwardRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box mt={0.75} display="flex" justifyContent="center">
        <Box component="span" sx={{ fontSize: '0.65rem', color: '#9CA3AF' }}>
          Enter para enviar · Shift+Enter nueva línea · Respuestas basadas en datos TUI
        </Box>
      </Box>
    </Box>
  );
}
