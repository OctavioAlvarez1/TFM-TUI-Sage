import { createTheme } from '@mui/material/styles';

const sharedComponents = {
  MuiPaper:     { styleOverrides: { root: { backgroundImage: 'none' } } },
  MuiAppBar:    { styleOverrides: { root: { backgroundImage: 'none' } } },
  MuiChip:      { styleOverrides: { root: { fontWeight: 500 } } },
  MuiAccordion: { styleOverrides: { root: { backgroundImage: 'none' } } },
} as const;

export function createLightTheme() {
  return createTheme({
    palette: {
      mode: 'light',
      primary:    { main: '#16A34A', light: '#4ADE80', dark: '#15803D' },
      secondary:  { main: '#C2410C', light: '#FB923C', dark: '#9A3412' },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      text:       { primary: '#0F172A', secondary: '#6B7280' },
      divider:    '#E5E7EB',
      error:      { main: '#DC2626' },
      warning:    { main: '#D97706' },
      success:    { main: '#65A30D' },
      info:       { main: '#0EA5E9' },
    },
    typography: { fontFamily: 'Inter, sans-serif' },
    shape: { borderRadius: 12 },
    components: sharedComponents,
  });
}

export function createDarkTheme() {
  return createTheme({
    palette: {
      mode: 'dark',
      primary:    { main: '#22C55E', light: '#4ADE80', dark: '#16A34A' },
      secondary:  { main: '#FB923C', light: '#FDBA74', dark: '#C2410C' },
      background: { default: '#0D1117', paper: '#161B22' },
      text:       { primary: '#E6EDF3', secondary: '#8B949E' },
      divider:    '#30363D',
      error:      { main: '#F87171' },
      warning:    { main: '#FBBF24' },
      success:    { main: '#4ADE80' },
      info:       { main: '#38BDF8' },
    },
    typography: { fontFamily: 'Inter, sans-serif' },
    shape: { borderRadius: 12 },
    components: sharedComponents,
  });
}

// Legacy export — kept so existing imports don't break
export const darkTheme = createLightTheme();
