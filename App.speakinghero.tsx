import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import SpeakingHero from './src/components/speaking/SpeakingHero';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
    '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
    '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
    '0px 24px 48px rgba(0, 0, 0, 0.35), 0px 19px 15px rgba(0, 0, 0, 0.22)',
    '0px 29px 58px rgba(0, 0, 0, 0.40), 0px 24px 18px rgba(0, 0, 0, 0.22)',
    '0px 34px 68px rgba(0, 0, 0, 0.45), 0px 29px 21px rgba(0, 0, 0, 0.22)',
    '0px 39px 78px rgba(0, 0, 0, 0.50), 0px 34px 24px rgba(0, 0, 0, 0.22)',
    '0px 44px 88px rgba(0, 0, 0, 0.55), 0px 39px 27px rgba(0, 0, 0, 0.22)',
    '0px 49px 98px rgba(0, 0, 0, 0.60), 0px 44px 30px rgba(0, 0, 0, 0.22)',
    '0px 54px 108px rgba(0, 0, 0, 0.65), 0px 49px 33px rgba(0, 0, 0, 0.22)',
    '0px 59px 118px rgba(0, 0, 0, 0.70), 0px 54px 36px rgba(0, 0, 0, 0.22)',
    '0px 64px 128px rgba(0, 0, 0, 0.75), 0px 59px 39px rgba(0, 0, 0, 0.22)',
    '0px 69px 138px rgba(0, 0, 0, 0.80), 0px 64px 42px rgba(0, 0, 0, 0.22)',
    '0px 74px 148px rgba(0, 0, 0, 0.85), 0px 69px 45px rgba(0, 0, 0, 0.22)',
    '0px 79px 158px rgba(0, 0, 0, 0.90), 0px 74px 48px rgba(0, 0, 0, 0.22)',
    '0px 84px 168px rgba(0, 0, 0, 0.95), 0px 79px 51px rgba(0, 0, 0, 0.22)',
    '0px 89px 178px rgba(0, 0, 0, 1.00), 0px 84px 54px rgba(0, 0, 0, 0.22)',
    '0px 94px 188px rgba(0, 0, 0, 1.00), 0px 89px 57px rgba(0, 0, 0, 0.22)',
    '0px 99px 198px rgba(0, 0, 0, 1.00), 0px 94px 60px rgba(0, 0, 0, 0.22)',
    '0px 104px 208px rgba(0, 0, 0, 1.00), 0px 99px 63px rgba(0, 0, 0, 0.22)',
    '0px 109px 218px rgba(0, 0, 0, 1.00), 0px 104px 66px rgba(0, 0, 0, 0.22)',
    '0px 114px 228px rgba(0, 0, 0, 1.00), 0px 109px 69px rgba(0, 0, 0, 0.22)',
  ],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <SpeakingHero />
      </Box>
    </ThemeProvider>
  );
}

export default App;