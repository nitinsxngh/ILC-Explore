'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Typography, Card, CardContent, Avatar, TextField, InputAdornment, IconButton, Chip, Stack, Button, CircularProgress } from '@mui/material';
import { IconCrown, IconBook, IconCalendar, IconUsers, IconFileText, IconBrain } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useUserProfile } from '@/hooks/useUserProfile';
import PersonalityTestResults from '@/components/PersonalityTestResults';
import ResumePreview from '@/components/ResumePreview';
import CareerTracksModal from '@/components/CareerTracksModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { userData, loading: userDataLoading, error: userDataError } = useUserData();
  const { isMentor, isStartup, isProfessor, loading: profileLoading, profile, updateProfile } = useUserProfile();
  const router = useRouter();
  const [showCareerTracksModal, setShowCareerTracksModal] = useState(false);

  // Redirect non-students to their respective dashboards
  useEffect(() => {
    if (!profileLoading) {
      if (isMentor) {
        router.replace('/mentor');
      } else if (isStartup) {
        router.replace('/startup');
      } else if (isProfessor) {
        router.replace('/professor');
      }
    }
  }, [isMentor, isStartup, isProfessor, profileLoading, router]);

  // Show career tracks modal for students who haven't subscribed
  useEffect(() => {
    if (!profileLoading && !isMentor && !isStartup && !isProfessor && user) {
      // Only show if profile exists and student details are completed but no track selected
      if (profile?.studentDetails?.completed && !profile.studentDetails?.careerTrack) {
        // Show modal after a short delay for better UX
        const timer = setTimeout(() => {
          setShowCareerTracksModal(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [profileLoading, isMentor, isStartup, isProfessor, profile, user]);

  const handleTrackSelection = async (track: "discovery" | "execution" | "acceleration") => {
    try {
      if (!user) return;

      // Update profile with selected career track using PUT method
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          studentDetails: {
            careerTrack: track,
          },
        }),
      });

      if (response.ok) {
        setShowCareerTracksModal(false);
        // Reload the page to refresh the profile data
        window.location.reload();
      } else {
        console.error("Failed to update career track");
      }
    } catch (error) {
      console.error("Error updating career track:", error);
    }
  };

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

  // Don't render student dashboard if user is not a student (will redirect)
  if (isMentor || isStartup || isProfessor) {
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

      {/* Career Tracks Modal */}
      <CareerTracksModal
        open={showCareerTracksModal}
        onClose={() => setShowCareerTracksModal(false)}
        onSelectTrack={handleTrackSelection}
        userName={user?.displayName || user?.email?.split('@')[0] || 'Student'}
      />
    </PageContainer>
  )
}

export default Dashboard;
