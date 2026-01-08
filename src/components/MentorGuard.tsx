"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Box, CircularProgress, Typography, Card, CardContent } from "@mui/material";

interface MentorGuardProps {
  children: React.ReactNode;
}

const MentorGuard: React.FC<MentorGuardProps> = ({ children }) => {
  const { isMentor, loading, hasRole } = useUserProfile();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!hasRole) {
        // User hasn't selected a role yet, redirect to dashboard
        setIsRedirecting(true);
        router.replace("/");
        return;
      } else if (!isMentor) {
        // User is not a mentor, immediately redirect to dashboard
        setIsRedirecting(true);
        router.replace("/");
        return;
      }
    }
  }, [isMentor, loading, hasRole, router]);

  // Show loading while checking role
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // If not a mentor or redirecting, show access denied and redirect
  if (!isMentor || isRedirecting) {
    // Redirect immediately
    if (!isRedirecting) {
      router.replace("/");
    }
    
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Card sx={{ maxWidth: 400, p: 3 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This page is only accessible to mentors.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to your dashboard...
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Only render children if user is confirmed mentor
  return <>{children}</>;
};

export default MentorGuard;

