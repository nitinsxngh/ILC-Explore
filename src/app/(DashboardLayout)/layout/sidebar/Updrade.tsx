import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const Upgrade = () => {
  // State to track login status
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  // Function to handle logout
  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    // Update the state to reflect the logout
    setUser(null);
  };

  return (
    <Box
      display='flex'
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 3, bgcolor: 'primary.light', borderRadius: '8px' }}
    >
      {user ? (
        // If user is logged in, show welcome message and logout button
        <Box>
          <Typography variant="h5" sx={{ width: "80px" }} fontSize='16px' mb={1}>
            Welcome, {user.name}!
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We are glad to have you back. Enjoy your session!
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
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
