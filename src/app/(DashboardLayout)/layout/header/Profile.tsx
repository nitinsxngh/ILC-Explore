"use client"; // Required for client-side components

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      handleClose2(); // Close the menu first
      await logout();
      router.push("/authentication/login");
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      // Show error to user if needed
      alert('Logout failed. Please try again.');
    }
  };

  // Navigate to account page
  const handleProfileClick = () => {
    router.push("/account"); // Navigate to the account page
    handleClose2(); // Close the dropdown
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show user profile"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={user?.photoURL || "/images/profile/user-1.jpg"}
          alt="Profile Picture"
          sx={{
            width: 40,
            height: 40,
          }}
        />
      </IconButton>
      {/* Profile Dropdown Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "250px",
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
        </Box>

        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button 
            onClick={handleLogout} 
            variant="outlined" 
            color="primary" 
            fullWidth
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
