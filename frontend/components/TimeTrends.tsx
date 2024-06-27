'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, CircularProgress, Alert, Box, useTheme } from '@mui/material';

interface TimeTrendData {
  period: string;
  gim: number;
  other_wards: number;
}

const TimeTrends: React.FC = () => {
  const [data, setData] = useState<TimeTrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/delirium/time-trends');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: TimeTrendData[] = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch time trends data:", err);
        setError("Failed to load time trends data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: 'white', p: 1, border: `1px solid ${theme.palette.grey[300]}` }}>
          <Typography variant="body2">{`Period: ${label}`}</Typography>
          <Typography variant="body2" color="primary">{`GIM: ${payload[0].value}`}</Typography>
          <Typography variant="body2" color="secondary">{`Other Wards: ${payload[1].value}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 400, width: '100%', p: 2 }}>
      {data.length > 0 ? (
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[200]} />
            <XAxis
              dataKey="period"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.grey[300] }}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.grey[300] }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: theme.palette.text.primary }}>{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="gim"
              name="GIM"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.main, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="other_wards"
              name="Other Wards"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.secondary.main, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body1" color="text.secondary">No data available</Typography>
      )}
    </Box>
  );
};

export default TimeTrends;
