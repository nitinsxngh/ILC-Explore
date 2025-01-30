import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // State to track login status and notification
  const [user, setUser] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // For snackbar notification

  // Check if the window object is available (i.e., client-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  const handleBellClick = () => {
    if (user) {
      setOpenSnackbar(true); // Open snackbar when bell is clicked
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close snackbar
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* Show the bell icon only if the user is logged in */}
        {user && (
          <IconButton
            size="large"
            aria-label="show 11 new notifications"
            color="inherit"
            aria-controls="msgs-menu"
            aria-haspopup="true"
            onClick={handleBellClick} // Handle bell click
          >
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
        )}

        <Box flexGrow={1} />

        {/* If user is logged in, show welcome message and profile, else show login button */}
        {user ? (
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Welcome, {user.name}!
            </Typography>
            <Profile />
          </Stack>
        ) : (
          <Button
            variant="contained"
            component={Link}
            href="/authentication/login"
            disableElevation
            color="primary"
          >
            Login
          </Button>
        )}
      </ToolbarStyled>

      {/* Snackbar to show the welcome message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={`Welcome, ${user?.name}!`}
      />
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
