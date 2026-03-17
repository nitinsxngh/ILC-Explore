'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, ssoChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && ssoChecked && !user) {
      const returnTo = window.location.href;
      window.location.assign(
        `https://auth.ilc.limited/login?returnTo=${encodeURIComponent(returnTo)}`
      );
    }
  }, [user, loading, ssoChecked, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
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

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
