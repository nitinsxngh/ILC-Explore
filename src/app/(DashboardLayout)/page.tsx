'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Typography, Card, CardContent, Avatar, TextField, InputAdornment, IconButton, Chip, Stack, Button, CircularProgress } from '@mui/material';
import { IconCrown, IconBook, IconCalendar, IconUsers, IconFileText, IconBrain } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useUserProfile } from '@/hooks/useUserProfile';
import PersonalityTestResults from '@/components/PersonalityTestResults';
import ResumePreview from '@/components/ResumePreview';

const Dashboard = () => {
  const { user } = useAuth();
  const { userData, loading: userDataLoading, error: userDataError } = useUserData();
  const { isMentor, loading: profileLoading } = useUserProfile();
  const router = useRouter();

  // Redirect mentors to mentor dashboard
  useEffect(() => {
    if (!profileLoading && isMentor) {
      router.replace('/mentor');
    }
  }, [isMentor, profileLoading, router]);

  // Show loading while checking role
  if (profileLoading) {
    return (
      <PageContainer title="Dashboard" description="Loading...">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Don't render student dashboard if user is a mentor (will redirect)
  if (isMentor) {
    return (
      <PageContainer title="Dashboard" description="Redirecting...">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  // Debug: Log current user info
  console.log('Current user:', user);
  console.log('User UID:', user?.uid);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <PageContainer title="Dashboard" description="Student Portal Dashboard">
      <Box sx={{ display: 'flex', gap: 3, minHeight: 'calc(100vh - 120px)' }}>
        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Welcome Banner */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    {currentDate}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Always stay updated in your student portal
                  </Typography>
                </Box>
                <Box sx={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 0, 
                  width: '300px', 
                  height: '100%',
                  background: 'url(/images/backgrounds/rocket.png) no-repeat center right',
                  backgroundSize: 'contain',
                  opacity: 0.1
                }} />
              </Box>
            </CardContent>
          </Card>


          {/* User Data Section */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Your Data
              </Typography>
              
              
              {userDataLoading ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading your data...
                  </Typography>
                </Box>
              ) : userDataError ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="error.main">
                    Error loading data: {userDataError}
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {/* Resume Data */}
                  {userData?.resume ? (
                    <ResumePreview resumeData={userData.resume} />
                  ) : (
                    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Resume Data
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No resume data found for your account.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Create your professional resume to showcase your skills and experience.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<IconFileText size={18} />}
                        onClick={() => window.open('https://resumebuilder.ilc.limited/editor', '_blank')}
                        sx={{ 
                          backgroundColor: '#1e3a8a',
                          '&:hover': {
                            backgroundColor: '#1e40af'
                          }
                        }}
                      >
                        Create Resume
                      </Button>
                    </Box>
                  )}
                  
                  {/* Personality Test Data */}
                  {userData?.personalityTest ? (
                    <PersonalityTestResults testData={userData.personalityTest} />
                  ) : (
                    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Personality Test Data
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No personality test data found for your account.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Discover your personality traits and get insights about yourself.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<IconBrain size={18} />}
                        onClick={() => window.open('https://personalitytest.ilc.limited/test', '_blank')}
                        sx={{ 
                          backgroundColor: '#7c3aed',
                          '&:hover': {
                            backgroundColor: '#8b5cf6'
                          }
                        }}
                      >
                        Take Personality Test
                      </Button>
                    </Box>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Enrolled Courses Section */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Enrolled Courses
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'primary.main', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  See all
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100px',
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                p: 3
              }}>
                <Typography variant="body2" color="text.secondary">
                  No enrolled courses to display
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Course Instructors */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Course instructors
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="/images/profile/user-1.jpg" 
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Dr. Sarah Johnson
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Computer Science
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="/images/profile/user-1.jpg" 
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Prof. Michael Chen
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mathematics
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="/images/profile/user-1.jpg" 
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Dr. Emily Davis
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Physics
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Daily Notice */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Daily notice
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'primary.main', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  See all
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Card sx={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  '&:hover': { boxShadow: 2 }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Prelim payment due
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Sorem ipsum dolor sit amet, consectetur c...sing elit.
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      See more
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  '&:hover': { boxShadow: 2 }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Exam schedule
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      See more
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
