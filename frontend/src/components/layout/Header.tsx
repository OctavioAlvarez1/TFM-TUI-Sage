import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(5,10,20,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(251,191,36,.12)',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <AutoAwesomeIcon sx={{ color: '#FBbf24', fontSize: 20 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          letterSpacing={3}
          sx={{ color: 'text.primary', userSelect: 'none' }}
        >
          SAGE
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5, mt: 0.3 }}>
          Spain Tourism Intelligence
        </Typography>
        <Box flex={1} />
        <Typography variant="caption" sx={{ color: 'rgba(251,191,36,.65)', fontWeight: 500 }}>
          TUI Care Foundation · Future Shapers Spain
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
