'use client';

import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Dialog, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CloseIcon from '@mui/icons-material/Close';

const events = [
  { id: 1, title: '7 days AI Bootcamp', date: 'Feb 10, 2025', pdf: 'https://res.cloudinary.com/dhsivjlew/image/upload/v1738498781/nubuxz6ybtwwk4dph3ub.pdf' },
  { id: 2, title: '7 Days Human Rights Bootcamp', date: 'Feb 10, 2025', pdf: 'https://res.cloudinary.com/dhsivjlew/image/upload/v1738498781/p3isjsmtflaaeoufimgz.pdf' },
  { id: 3, title: '7 Days Legal Bootcamp', date: 'Jan 18, 2025', pdf: 'https://res.cloudinary.com/dhsivjlew/image/upload/v1738499291/dqx8fy56v9kkrrbgtwmw.pdf' },
  { id: 4, title: 'Sales & Marketing Management', date: 'Jan 15, 2025', pdf: 'https://res.cloudinary.com/dhsivjlew/image/upload/v1738499291/owbpqrcnjepoioeqcmvc.pdf' }
];

const EventsPage = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <PageContainer title="Events" description="Upcoming events and meetups">
      <DashboardCard title="Upcoming Events">
        <Box sx={{ textAlign: 'center', padding: 4, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Stay Updated with Our Events 📅
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card 
                  sx={{ 
                    mb: 2, 
                    backgroundColor: '#ffffff', 
                    cursor: 'pointer', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                  onClick={() => setSelectedPdf(event.pdf)}
                >
                  <Box sx={{ width: '100%', height: 150, overflow: 'hidden' }}>
                    <iframe 
                      src={`${event.pdf}#toolbar=0&navpanes=0&scrollbar=0`} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 'none', pointerEvents: 'none' }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {event.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DashboardCard>

      {/* PDF Preview Dialog */}
      <Dialog open={Boolean(selectedPdf)} onClose={() => setSelectedPdf(null)} maxWidth="md" fullWidth>
        <Box sx={{ position: 'relative', padding: 2 }}>
          <IconButton 
            onClick={() => setSelectedPdf(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedPdf && (
            <Box sx={{ width: '100%', height: '80vh' }}>
              <iframe 
                src={selectedPdf} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </PageContainer>
  );
};

export default EventsPage;
