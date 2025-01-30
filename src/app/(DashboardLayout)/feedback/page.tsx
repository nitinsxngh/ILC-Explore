'use client';

import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Feedback = () => {
  return (
    <PageContainer title="Feedback" description="Currently no feedback available">
      <DashboardCard title="Feedback">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            No Feedback for You! 😅
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We don’t have any feedback available right now. Stay tuned.
          </Typography>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Feedback;
