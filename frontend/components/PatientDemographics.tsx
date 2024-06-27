'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';

interface DemographicItem {
  q4_2022: string;
  training: string;
  standard_mean_difference: string;
}

interface PatientDemographicsData {
  data: Record<string, DemographicItem>;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PatientDemographics: React.FC = () => {
  const [demographics, setDemographics] = useState<PatientDemographicsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const response = await fetch('/api/delirium/demographics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PatientDemographicsData = await response.json();
        console.log("Received data:", data);
        setDemographics(data);
      } catch (err) {
        console.error("Failed to fetch demographics:", err);
        setError("Failed to load patient demographics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemographics();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!demographics) {
    return <Alert severity="info">No demographic data available.</Alert>;
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Attribute</StyledTableCell>
            <StyledTableCell align="right">Q4 2022</StyledTableCell>
            <StyledTableCell align="right">Training</StyledTableCell>
            <StyledTableCell align="right">Standard Mean Difference</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(demographics.data).map(([attribute, item]) => (
            <StyledTableRow key={attribute}>
              <StyledTableCell component="th" scope="row">
                {attribute}
              </StyledTableCell>
              <StyledTableCell align="right">{item.q4_2022}</StyledTableCell>
              <StyledTableCell align="right">{item.training}</StyledTableCell>
              <StyledTableCell align="right">{item.standard_mean_difference}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientDemographics;
