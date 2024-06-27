'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

interface DeliriumRate {
  quarter: string;
  rate: number;
}

const DeliriumRates: React.FC = () => {
  const [rates, setRates] = useState<DeliriumRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/delirium/rates');
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
    if (rate > 30) return '#ff6b6b';
    if (rate > 20) return '#feca57';
    return '#48dbfb';
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {rates.map((item) => (
          <Box key={item.quarter} sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={240}
              thickness={8}
              sx={{
                color: '#f0f0f0', // Light grey color for the background
                position: 'absolute',
              }}
            />
            <CircularProgress
              variant="determinate"
              value={item.rate}
              size={240}
              thickness={8}
              sx={{ color: getColor(item.rate) }}
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
              <Typography variant="caption" component="div" color="text.secondary">
                {`${item.rate}%`}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ mt: 1, textAlign: 'center' }}>
              {item.quarter}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DeliriumRates;
