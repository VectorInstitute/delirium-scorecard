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
  CircularProgress,
  Alert,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface DemographicValue {
  value: number;
  units: string;
  standard_deviation?: number;
}

interface DemographicItem {
  recent: DemographicValue;
  training: DemographicValue;
  standard_mean_difference: DemographicValue;
}

interface PatientDemographicsData {
  data: Record<string, DemographicItem>;
  recent_quarter: string;
  recent_year: number;
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

const formatValue = (value: DemographicValue): string => {
  let formattedValue = `${value.value} ${value.units}`;
  if (value.standard_deviation !== undefined) {
    formattedValue += ` [${value.standard_deviation}]`;
  }
  return formattedValue;
};

const PatientDemographics: React.FC = () => {
  const [demographics, setDemographics] = useState<PatientDemographicsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const response = await fetch('/api/demographics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PatientDemographicsData = await response.json();
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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!demographics || !demographics.data) return <Alert severity="info">No demographic data available.</Alert>;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Attribute</StyledTableCell>
            <StyledTableCell align="right">{demographics.recent_quarter} {demographics.recent_year}</StyledTableCell>
            <StyledTableCell align="right">Training</StyledTableCell>
            <StyledTableCell align="right">Standard Mean Difference</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(demographics.data).map(([attribute, item]) => (
            <StyledTableRow key={attribute}>
              <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{attribute}</StyledTableCell>
              <StyledTableCell align="right">{formatValue(item.recent)}</StyledTableCell>
              <StyledTableCell align="right">{formatValue(item.training)}</StyledTableCell>
              <StyledTableCell align="right">{formatValue(item.standard_mean_difference)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientDemographics;
