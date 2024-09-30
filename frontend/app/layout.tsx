import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './globals.css';
import ThemeRegistry from './theme-registry';
import Sidebar from '../components/sidebar';
import { AuthProvider } from './context/auth';

export const metadata = {
  title: 'Delirium Scorecard',
  description: 'Sunnybrook Hospital Delirium Scorecard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <CssBaseline />
            <AuthProvider>
            <Box sx={{ display: 'flex' }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '8px' }}>
                {children}
                </Box>
              </Box>
            </AuthProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
