'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, useTheme, useMediaQuery } from '@mui/material';

interface DeliriumRate {
  quarter: string;
  year: number;
  rate: number;
  ward: string;
}

const DeliriumRates: React.FC = () => {
  const [rates, setRates] = useState<DeliriumRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/rates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DeliriumRate[] = await response.json();
        setRates(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch delirium rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColor = (rate: number): string => {
    if (rate > 30) return theme.palette.error.main;
    if (rate > 20) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {rates.map((item) => (
        <Box key={`${item.quarter}-${item.year}`} sx={{ m: 2, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={isLargeScreen ? 200 : 150}
              thickness={5}
              sx={{ color: theme.palette.grey[200] }}
            />
            <CircularProgress
              variant="determinate"
              value={item.rate}
              size={isLargeScreen ? 200 : 150}
              thickness={5}
              sx={{ color: getColor(item.rate), position: 'absolute', left: 0 }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" component="div" color="text.secondary">
                {`${item.rate}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {`${item.quarter} ${item.year}`}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DeliriumRates;
