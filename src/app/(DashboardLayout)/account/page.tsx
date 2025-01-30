"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, Typography, TextField, Button, Container, Avatar, Card, CardContent 
} from "@mui/material";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  username: string;
  role: string;
  college: string;
  course: string;
  specialisation: string;
  expertType: string;
  phone: string;
  expertise: string;
  yearsOfExperience: number;
}

const AccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle Save
  const handleSave = async () => {
    if (formData && formData._id) {
      setLoading(true);  // Set loading to true when saving
      try {
        console.log("Sending data to server:", formData);  // Log the data to confirm
        const response = await fetch(`https://api.ilc.limited/api/users/${formData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update user');
        }
  
        const updatedUser = await response.json();
        console.log("Received updated user:", updatedUser);  // Log the response
        localStorage.setItem("user", JSON.stringify(updatedUser));  // Update localStorage with new data
        setUser(updatedUser);  // Update state with new user data
        setEditMode(false);  // Switch to view mode
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to save changes. Please try again.');
      } finally {
        setLoading(false);  // Reset loading state
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/authentication/login");
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4">My Account</Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={{ mb: 3, textAlign: "center", p: 2 }}>
        <Avatar 
          src="/images/profile/user-1.jpg" 
          alt={user.name} 
          sx={{ width: 80, height: 80, margin: "auto" }} 
        />
        <CardContent>
          <Typography variant="h6">{user.name || "N/A"}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.role?.toUpperCase() || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* User Details Form */}
      <Box display="flex" flexDirection="column" gap={2}>
        {Object.keys(user).map((key) => {
          // Disable email and role fields when editing
          const isEditable = !(key === "email" || key === "role");

          return (
            key !== "password" && (
              <TextField
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())} // Format field name
                name={key}
                value={formData?.[key as keyof User] || "N/A"}
                onChange={handleChange}
                disabled={!editMode || !isEditable}
                fullWidth
              />
            )
          );
        })}

        {editMode ? (
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default AccountPage;
