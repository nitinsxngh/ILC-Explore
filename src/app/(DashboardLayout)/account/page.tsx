"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, Typography, TextField, Button, Container, Avatar, Card, CardContent 
} from "@mui/material";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  age?: number;
  email: string;
  username?: string;
  category: string; 
  college?: string;
  course?: string;
  specialisation?: string;
  expertType?: string;
  phone?: string;
  expertise?: string;
  yearsOfExperience?: number;
}

const AccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          const response = await fetch(`https://api.ilc.limited/api/users/email/${parsedUser.email}`);

          
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
  
          const data = await response.json();
  
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user)); // Store updated data
            setUser(data.user);
            setFormData(data.user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
  
    fetchUser();
  }, []);
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (formData && formData.email) {
      setLoading(true);
  
      try {
        const lowerCaseEmail = formData.email.toLowerCase();
  
        const response = await fetch(`https://api.ilc.limited/api/users/${lowerCaseEmail}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update user: ${errorText}`);
        }
  
        const data = await response.json();

        if (data.user) {
          // Store updated user data properly
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          setFormData(data.user);
        }
  
        alert("User updated successfully!"); 
        setEditMode(false);
      } catch (error) {
        console.error("Error updating user:", error);
        alert(`Failed to save changes: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("FormData is null or missing email");
    }
  };


  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4">Profile Card</Typography>
      </Box>

      <Card sx={{ mb: 3, textAlign: "center", p: 2 }}>
        <Avatar 
          src="/images/profile/user-1.jpg" 
          alt={user.name} 
          sx={{ width: 80, height: 80, margin: "auto" }} 
        />
        <CardContent>
          <Typography variant="h6">{user.name || "N/A"}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.category?.toUpperCase() || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          name="name"
          value={formData?.name || ""}
          onChange={handleChange}
          disabled={!editMode}
          fullWidth
        />

        {user.category === "professor" || user.category === "professional" ? (
          <>
            <TextField
              label="Expertise"
              name="expertise"
              value={formData?.expertise || ""}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            <TextField
              label="Years of Experience"
              name="yearsOfExperience"
              type="number"
              value={formData?.yearsOfExperience || ""}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
          </>
        ) : null}

        {user.category === "student" ? (
          <>
            <TextField
              label="College"
              name="college"
              value={formData?.college || ""}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            <TextField
              label="Course"
              name="course"
              value={formData?.course || ""}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            <TextField
              label="Specialisation"
              name="specialisation"
              value={formData?.specialisation || ""}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
          </>
        ) : null}

        {editMode ? (
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}

      </Box>
    </Container>
  );
};

export default AccountPage;
