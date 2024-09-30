import React from 'react';
import { Grid, Paper, Typography, Divider, Box } from '@mui/material';
import DeliriumRates from '../components/delirium-rates';
import TimeTrends from '../components/time-trends';
import PatientDemographics from '../components/patient-demographics';
import { withAuth } from '../components/with-auth'

export default function Home() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Delirium Scorecard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Rates of Delirium: GIM
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <DeliriumRates />
          </Paper>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Time Trends
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TimeTrends />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Patient Demographics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <PatientDemographics />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
