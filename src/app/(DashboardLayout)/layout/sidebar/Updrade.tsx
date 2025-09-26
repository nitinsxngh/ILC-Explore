import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const Upgrade = () => {
  const { user } = useAuth();

  return (
    <Box
      display='flex'
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 3, bgcolor: 'primary.light', borderRadius: '8px' }}
    >
      {user ? (
        // If user is logged in, show welcome message only
        <Box>
          <Typography variant="h5" sx={{ width: "80px" }} fontSize='16px' mb={1}>
            Welcome, {user.displayName || user.email?.split('@')[0] || 'User'}!
          </Typography>
          <Typography variant="body2">
            We are glad to have you back. Enjoy your session!
          </Typography>
        </Box>
      ) : (
        // If user is not logged in, show the "Sign Up" button
        <>
          <Box>
            <Typography variant="h5" sx={{ width: "80px" }} fontSize='16px' mb={1}>
              Not have account?
            </Typography>
            <Button
              color="primary"
              target="_blank"
              disableElevation
              component={Link}
              href="/authentication/register"
              variant="contained"
              aria-label="signup"
              size="small"
            >
              Sign Up
            </Button>
          </Box>
          <Box mt="-35px">
            <Image alt="Rocket" src='/images/backgrounds/rocket.png' width={100} height={100} />
          </Box>
        </>
      )}
    </Box>
  );
};
