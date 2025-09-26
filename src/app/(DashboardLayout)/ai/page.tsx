'use client';
import { Typography, Box, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Ai = () => {
  return (
    <PageContainer title="AI - Coming Soon" description="Stay tuned for something awesome">
      <DashboardCard title="AI Features - Coming Soon">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            🚀 Big Things Are Coming!
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3 }}>
            Our AI powered features are under construction. We are working hard to bring you something amazing.
          </Typography>
          <Typography variant="h6" sx={{ color: 'gray', mb: 4 }}>
            Stay tuned. The wait will be worth it! 💡
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#0069d9', // Customize hover color
              },
            }}
            onClick={() => alert('We are working on it! Stay tuned!')}
          >
            Get Notified
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Ai;
