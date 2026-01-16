"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useUserProfile } from "@/hooks/useUserProfile";

interface StartupGuardProps {
  children: React.ReactNode;
}

const StartupGuard: React.FC<StartupGuardProps> = ({ children }) => {
  const { isStartup, loading, hasRole } = useUserProfile();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!hasRole) {
        // User hasn't selected a role yet, redirect to main dashboard
        setIsRedirecting(true);
        router.replace("/");
      } else if (!isStartup) {
        // User is not a startup, immediately redirect to dashboard
        setIsRedirecting(true);
        router.replace("/");
      }
    }
  }, [isStartup, loading, hasRole, router]);

  // Show loading while checking
  if (loading || isRedirecting) {
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
        <CircularProgress />
        {isRedirecting && (
          <Typography variant="body2" color="text.secondary">
            Access Denied. Redirecting...
          </Typography>
        )}
      </Box>
    );
  }

  // If not a startup or redirecting, show access denied and redirect
  if (!isStartup || isRedirecting) {
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
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This page is only accessible to startups.
        </Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  // Only render children if user is confirmed startup
  return <>{children}</>;
};

export default StartupGuard;

