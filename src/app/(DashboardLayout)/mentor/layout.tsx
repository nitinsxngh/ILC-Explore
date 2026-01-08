"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMentor, loading, hasRole } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!hasRole || !isMentor) {
        // Immediately redirect non-mentors
        router.replace("/");
      }
    }
  }, [isMentor, loading, hasRole, router]);

  // Show loading while checking
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

  // Don't render anything if not a mentor (will redirect)
  if (!isMentor) {
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
          Redirecting...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

