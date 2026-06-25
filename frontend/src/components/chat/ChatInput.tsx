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
        borderTop: '1.5px solid #D1FAE5',
        background: '#F8FFF9',
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
              '& fieldset': { borderColor: '#D1FAE5' },
              '&:hover fieldset': { borderColor: '#86EFAC' },
              '&.Mui-focused fieldset': { borderColor: '#16A34A' },
            },
            '& input::placeholder, & textarea::placeholder': {
              color: '#9CA3AF',
              opacity: 1,
            },
          }}
        />
        <IconButton
          onClick={submit}
          disabled={!value.trim() || disabled}
          sx={{
            bgcolor: '#16A34A',
            color: '#FFFFFF',
            borderRadius: '10px',
            width: 40,
            height: 40,
            flexShrink: 0,
            '&:hover': { bgcolor: '#15803D' },
            '&.Mui-disabled': { bgcolor: '#D1FAE5', color: '#9CA3AF' },
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
