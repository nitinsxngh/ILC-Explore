"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useUserProfile } from "@/hooks/useUserProfile";

interface ProfessorGuardProps {
  children: React.ReactNode;
}

const ProfessorGuard: React.FC<ProfessorGuardProps> = ({ children }) => {
  const { isProfessor, loading, hasRole } = useUserProfile();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!hasRole) {
        // User hasn't selected a role yet, redirect to main dashboard
        setIsRedirecting(true);
        router.replace("/");
      } else if (!isProfessor) {
        // User is not a professor, immediately redirect to dashboard
        setIsRedirecting(true);
        router.replace("/");
      }
    }
  }, [isProfessor, loading, hasRole, router]);

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

  // If not a professor or redirecting, show access denied and redirect
  if (!isProfessor || isRedirecting) {
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
          This page is only accessible to professors.
        </Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  // Only render children if user is confirmed professor
  return <>{children}</>;
};

export default ProfessorGuard;

