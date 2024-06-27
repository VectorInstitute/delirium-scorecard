// pages/index.tsx (and other pages)
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import Layout from '../components/Layout';
import DeliriumRates from '../components/DeliriumRates';
import TimeTrends from '../components/TimeTrends';
import PatientDemographics from '../components/PatientDemographics';

export default function Home() {
  return (
    <Layout>
      <Typography variant="h3" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
        Delirium Scorecard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              Rates of Delirium: GIM
            </Typography>
            <DeliriumRates />
          </Paper>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              Time Trends
            </Typography>
            <TimeTrends />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              Patient Demographics
            </Typography>
            <PatientDemographics />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
