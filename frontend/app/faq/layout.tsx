import React from 'react';
import { Container, Box } from '@mui/material';

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="md">
      <Box
        py={4}
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '-8x', // Adjust this value to match your sidebar width
          width: { sm: `calc(100%)` },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
