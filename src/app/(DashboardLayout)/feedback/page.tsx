'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Feedback = () => {
  const [emailVisible, setEmailVisible] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim()) {
      alert(`Feedback submitted! You can also email us at info@ilc.limited`);
      setFeedback('');
    }
  };

  return (
    <PageContainer title="Feedback" description="Provide your valuable feedback">
      <DashboardCard title="Feedback">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Your Feedback Matters! 😊
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Please share your thoughts with us. You can also email us at{' '}
            <strong>info@ilc.limited</strong>
          </Typography>
          <TextField
            fullWidth
            label="Write your feedback"
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onFocus={() => setEmailVisible(true)}
            sx={{ mb: 3 }}
          />
          {emailVisible && (
            <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
              You can also reach us at: <strong>info@ilc.limited</strong>
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Feedback;
