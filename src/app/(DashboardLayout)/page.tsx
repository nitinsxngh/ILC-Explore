'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Typography, Card, CardContent, Avatar, TextField, InputAdornment, IconButton, Chip, Stack, Button, CircularProgress, Dialog, DialogTitle, DialogContent, Divider, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { IconCrown, IconBook, IconCalendar, IconUsers, IconFileText, IconBrain, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
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
  const psychologistsCarouselRef = useRef<HTMLDivElement | null>(null);

  const psychologists = [
    { name: 'Trishna', webinarDone: true, fees: { '30': 500, '45': 600, '60': 1000 } },
    { name: 'Rakhi Gupta', webinarDone: false, fees: { '30': 1000, '45': 1500, '60': 2200 } },
    { name: 'Kanika', webinarDone: true, fees: { '30': 500, '45': 700, '60': 1000 } },
    { name: 'Annanya', webinarDone: false, fees: { '30': 700, '45': 1000, '60': 1300 } },
    { name: 'Drishti Goel', webinarDone: false, fees: { '30': 500, '45': 700, '60': 1000 } },
  ];

  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
  const durationOptions = ['30', '45', '60'] as const;
  type DurationOption = (typeof durationOptions)[number];

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState<typeof psychologists[number] | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>('30');
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  };

  const psychologistCardWidth = 250;

  const scrollPsychologists = (direction: 'left' | 'right') => {
    const container = psychologistsCarouselRef.current;
    if (!container) return;
    const scrollAmount = direction === 'left' ? -psychologistCardWidth : psychologistCardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const openBooking = (psychologist: typeof psychologists[number]) => {
    setSelectedPsychologist(psychologist);
    setSelectedDuration('30');
    setSelectedSlot(timeSlots[0]);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
  };

  const handlePay = () => {
    if (!selectedPsychologist) return;
    const amount = selectedPsychologist.fees[selectedDuration];
    console.log('Proceed to payment', {
      psychologist: selectedPsychologist.name,
      duration: selectedDuration,
      slot: selectedSlot,
      amount,
    });
    setBookingOpen(false);
  };

  useEffect(() => {
    const container = psychologistsCarouselRef.current;
    if (!container) return;

    const tick = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const step = Math.max(psychologistCardWidth, container.clientWidth - 60);
      const nextLeft = container.scrollLeft + step;
      const targetLeft = nextLeft >= maxScrollLeft ? 0 : nextLeft;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    };

    const intervalId = window.setInterval(tick, 3500);
    return () => window.clearInterval(intervalId);
  }, []);

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
          {/* Psychologists Carousel */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Psychologists
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => scrollPsychologists('left')}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    aria-label="Scroll psychologists left"
                  >
                    <IconChevronLeft size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => scrollPsychologists('right')}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    aria-label="Scroll psychologists right"
                  >
                    <IconChevronRight size={18} />
                  </IconButton>
                </Box>
              </Box>

              <Box
                ref={psychologistsCarouselRef}
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  pb: 1,
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#cbd5f5',
                    borderRadius: 999,
                  },
                  '&::-webkit-scrollbar-track': { backgroundColor: '#f1f5f9' },
                }}
              >
                {psychologists.map((psychologist) => (
                    <Card
                    key={psychologist.name}
                    sx={{
                      minWidth: 270,
                      flex: '0 0 auto',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      scrollSnapAlign: 'start',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 2 },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', color: 'primary.main', fontSize: 14 }}>
                          {getInitials(psychologist.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {psychologist.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Clinical Psychologist
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        size="small"
                        label={psychologist.webinarDone ? 'Webinar complete' : 'Webinar pending'}
                        color={psychologist.webinarDone ? 'success' : 'warning'}
                        variant="outlined"
                        sx={{ mb: 1.5, fontWeight: 500 }}
                      />

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Fees (30/45/60 mins)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{psychologist.fees['30']} / ₹{psychologist.fees['45']} / ₹{psychologist.fees['60']}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600 }}
                        onClick={() => openBooking(psychologist)}
                      >
                        Book session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
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

      <Dialog open={bookingOpen} onClose={closeBooking} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Book session
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {selectedPsychologist?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select time slot and duration
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Time slot
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {timeSlots.map((slot) => (
                <Chip
                  key={slot}
                  label={slot}
                  clickable
                  color={selectedSlot === slot ? 'primary' : 'default'}
                  variant={selectedSlot === slot ? 'filled' : 'outlined'}
                  onClick={() => setSelectedSlot(slot)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Duration
            </Typography>
            <RadioGroup
              row
              value={selectedDuration}
              onChange={(event) => setSelectedDuration(event.target.value as DurationOption)}
            >
              {durationOptions.map((duration) => (
                <FormControlLabel
                  key={duration}
                  value={duration}
                  control={<Radio size="small" />}
                  label={`${duration} mins`}
                />
              ))}
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₹{selectedPsychologist?.fees[selectedDuration] ?? 0}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
            onClick={handlePay}
            disabled={!selectedPsychologist}
          >
            Pay now
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

export default Dashboard;
