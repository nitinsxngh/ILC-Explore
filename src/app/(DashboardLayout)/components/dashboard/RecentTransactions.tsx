import React, { useState, useEffect } from 'react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Link, Typography } from '@mui/material';

const CourseEnrollmentProcess = () => {
  const [user, setUser] = useState<any>(null);

  // Check if the window object is available (i.e., client-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData)); // Set user if found in localStorage
      }
    }
  }, []);

  return (
    <DashboardCard title="Course Enrollment Process">
      <Timeline
        className="theme-timeline"
        sx={{
          p: 0,
          mb: '-40px',
          '& .MuiTimelineConnector-root': {
            width: '1px',
            backgroundColor: '#efefef',
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.5,
            paddingLeft: 0,
          },
        }}
      >
        {/* Explore Course */}
        <TimelineItem>
          <TimelineOppositeContent>Step 1</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            Explores available courses on the platform.
          </TimelineContent>
        </TimelineItem>

        {/* Conditionally Render Sign Up */}
        {!user ? (
          <TimelineItem>
            <TimelineOppositeContent>Step 2</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">Sign up for an account</Typography>
              <Link href="/register" underline="none">
                Register Here
              </Link>
            </TimelineContent>
          </TimelineItem>
        ) : (
          <TimelineItem>
            <TimelineOppositeContent>Step 2</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">Already Registered</Typography>
            </TimelineContent>
          </TimelineItem>
        )}

        {/* Course Enrollment */}
        <TimelineItem>
          <TimelineOppositeContent>Step 3</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="success" variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            Selects a course or notes from library and enrolls in it.
          </TimelineContent>
        </TimelineItem>

        {/* Confirmation */}
        <TimelineItem>
          <TimelineOppositeContent>Step 4</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="warning" variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight="600">Course enrollment confirmed</Typography>
            <Link href="/" underline="none">
              {/* No link provided for this step */}
            </Link>
          </TimelineContent>
        </TimelineItem>

        {/* Start Course */}
        <TimelineItem>
          <TimelineOppositeContent>Step 5</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="success" variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            Begins the course after enrollment.
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </DashboardCard>
  );
};

export default CourseEnrollmentProcess;
