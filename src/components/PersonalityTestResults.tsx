import React from 'react';
import { Box, Typography, LinearProgress, Chip, Stack, Button } from '@mui/material';
import { IconExternalLink } from '@tabler/icons-react';

interface PersonalityTestResultsProps {
  testData: any;
}

const PersonalityTestResults: React.FC<PersonalityTestResultsProps> = ({ testData }) => {
  if (!testData || !testData.answers) return null;

  // Calculate domain scores
  const domainScores = testData.answers.reduce((acc: any, answer: any) => {
    const domain = answer.domain;
    if (!acc[domain]) {
      acc[domain] = { total: 0, count: 0 };
    }
    acc[domain].total += answer.score;
    acc[domain].count += 1;
    return acc;
  }, {});

  // Calculate average scores for each domain
  const domainAverages = Object.keys(domainScores).map(domain => ({
    domain,
    average: domainScores[domain].total / domainScores[domain].count,
    max: 5
  }));

  const domainNames: { [key: string]: string } = {
    'N': 'Neuroticism',
    'E': 'Extraversion', 
    'O': 'Openness',
    'A': 'Agreeableness',
    'C': 'Conscientiousness'
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'success';
    if (score >= 3) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Personality Test Results
      </Typography>
      
      <Stack spacing={2}>
        {domainAverages.map(({ domain, average, max }) => (
          <Box key={domain}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {domainNames[domain] || domain}
              </Typography>
              <Chip 
                label={`${average.toFixed(1)}/${max}`}
                size="small"
                color={getScoreColor(average) as any}
                variant="outlined"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(average / max) * 100}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(average) === 'success' ? '#10b981' : 
                                 getScoreColor(average) === 'warning' ? '#f59e0b' : '#ef4444'
                }
              }}
            />
          </Box>
        ))}
      </Stack>
      
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Test completed in {testData.timeElapsed} seconds • {testData.answers.length} questions answered
          </Typography>
          <Button
            size="small"
            startIcon={<IconExternalLink size={16} />}
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => window.open(`https://personalitytest.ilc.limited/result/${testData._id}`, '_blank')}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalityTestResults;
