'use client';

import React from 'react';
import { Typography, Button, Box } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4" gutterBottom color="error">
        Something went wrong!
      </Typography>
      <Typography variant="body1" paragraph>
        We apologize for the inconvenience. Please try again.
      </Typography>
      <Button
        onClick={() => reset()}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Try again
      </Button>
    </Box>
  );
}
