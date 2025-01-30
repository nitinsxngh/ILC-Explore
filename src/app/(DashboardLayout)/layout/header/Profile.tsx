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
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const router = useRouter(); // Use the App Router-compatible useRouter

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    router.push("/authentication/login"); // Redirect using App Router navigation
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
          src="/images/profile/user-1.jpg"
          alt="Profile Picture"
          sx={{
            width: 35,
            height: 35,
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
            width: "200px",
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
