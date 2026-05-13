import { createTheme } from '@mui/material/styles';
export const getTheme = (dark: boolean) => createTheme({
  palette: {
    mode: dark ? 'dark' : 'light',
    primary: { main: '#1976D2' },
    secondary: { main: '#E91E63' },
    background: { default: dark ? '#0a0a0a' : '#F0F2F5', paper: dark ? '#1a1a1a' : '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    h5: { fontWeight: 800 }, h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none', border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700, borderRadius: 8 } } },
  },
});
