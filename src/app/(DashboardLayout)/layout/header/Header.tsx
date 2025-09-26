import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography, TextField, InputAdornment, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import NotificationSidebar from './NotificationSidebar';
import { IconBellRinging, IconMenu, IconSearch } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const [openNotificationSidebar, setOpenNotificationSidebar] = useState(false);
  const { user, logout } = useAuth();

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
      setOpenNotificationSidebar(true);
    }
  };

  const handleNotificationSidebarClose = () => {
    setOpenNotificationSidebar(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

        {/* Search Bar - Centered */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', maxWidth: '400px', mx: 'auto' }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#f8fafc',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e3a8a',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="20" color="#64748b" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right side - User profile and notifications */}
        <Stack spacing={1} direction="row" alignItems="center">
          {/* User Profile */}
          {user ? (
            <Profile />
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

          {/* Notification Bell */}
          {user && (
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleBellClick}
            >
              <Badge badgeContent={3} color="primary">
                <IconBellRinging size="21" stroke="1.5" />
              </Badge>
            </IconButton>
          )}
        </Stack>
      </ToolbarStyled>

      {/* Notification Sidebar */}
      <NotificationSidebar
        open={openNotificationSidebar}
        onClose={handleNotificationSidebarClose}
      />
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
