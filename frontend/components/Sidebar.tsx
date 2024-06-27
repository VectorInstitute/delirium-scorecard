// components/Sidebar.tsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Dashboard, Help } from '@mui/icons-material';
import Link from 'next/link';

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f0f8ff',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Sunnybrook Hospital
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#666' }}>
          April 2018 - Mar 2024
        </Typography>
      </Box>
      <List>
        <Link href="/" passHref legacyBehavior>
          <ListItem button component="a">
            <ListItemIcon>
              <Dashboard sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Link href="/faq" passHref legacyBehavior>
          <ListItem button component="a">
            <ListItemIcon>
              <Help sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="FAQ" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default Sidebar;
