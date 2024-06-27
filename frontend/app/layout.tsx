import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './globals.css';
import ThemeRegistry from './ThemeRegistry';
import Sidebar from '../components/Sidebar';

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
            <Box sx={{ display: 'flex' }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px' }}>
                {children}
              </Box>
            </Box>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
