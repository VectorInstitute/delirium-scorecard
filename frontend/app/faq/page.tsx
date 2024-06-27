'use client';

import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: "What is delirium?",
    answer: "Delirium is a serious disturbance in mental abilities that results in confused thinking and reduced awareness of the environment. It often develops rapidly and can fluctuate in severity over the course of a day."
  },
  {
    question: "How is the delirium rate calculated?",
    answer: "The delirium rate is calculated as the percentage of patients who develop delirium during their hospital stay. It's typically measured by dividing the number of patients diagnosed with delirium by the total number of patients admitted, and then multiplying by 100 to get a percentage."
  },
  {
    question: "What do the colors in the Rates of Delirium chart mean?",
    answer: "In the Rates of Delirium chart, the colors indicate different severity levels: Red indicates high rates (>30%), yellow indicates medium rates (20-30%), and blue indicates low rates (<20%). These color codes help quickly identify areas of concern or improvement."
  }
];

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&.Mui-expanded': {
    minHeight: 48,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

export default function FAQPage() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <StyledAccordion key={index}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}
          >
            <Typography variant="h6">{faq.question}</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography>{faq.answer}</Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Box>
  );
}
