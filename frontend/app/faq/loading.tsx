import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress color="primary" size={60} thickness={4} />
    </Box>
  );
}
