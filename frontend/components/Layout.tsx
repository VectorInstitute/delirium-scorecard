// components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '-500px', // Adjust this value to match your sidebar width
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
