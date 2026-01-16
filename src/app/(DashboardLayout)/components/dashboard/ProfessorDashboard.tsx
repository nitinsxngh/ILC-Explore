"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  IconUsers,
  IconBook,
  IconTrendingUp,
  IconStar,
  IconUserCircle,
  IconSchool,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const professorDetails = profile?.professorDetails;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mock stats - can be replaced with actual data
  const stats = {
    totalStudents: 0,
    activeCourses: 0,
    publications: 0,
    averageRating: 4.7,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Welcome Banner - Professor Style */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
          color: "white",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CardContent sx={{ p: 4, position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {currentDate}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome, {professorDetails?.fullName || user?.displayName || "Professor"}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {professorDetails?.collegeUniversityName || "Your Institution"}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={professorDetails?.subjectDepartment || "Department"}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={professorDetails?.yearsOfTeachingExperience || "Experience"}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
              </Stack>
            </Box>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                fontSize: "2.5rem",
                fontWeight: 600,
              }}
            >
              {professorDetails?.fullName?.charAt(0) || user?.displayName?.charAt(0) || "P"}
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(30, 64, 175, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ color: "#1e40af", mb: 0.5 }}>
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e3a8a", fontWeight: 500 }}>
                    Total Students
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    color: "#1e40af",
                  }}
                >
                  <IconUsers size={28} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ color: "#6366f1", mb: 0.5 }}>
                    {stats.activeCourses}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f46e5", fontWeight: 500 }}>
                    Active Courses
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    color: "#6366f1",
                  }}
                >
                  <IconBook size={28} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ color: "#16a34a", mb: 0.5 }}>
                    {stats.publications}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 500 }}>
                    Publications
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    color: "#16a34a",
                  }}
                >
                  <IconSchool size={28} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ color: "#d97706", mb: 0.5 }}>
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b45309", fontWeight: 500 }}>
                    Average Rating
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    color: "#d97706",
                  }}
                >
                  <IconStar size={28} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Courses */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ color: "#1f2937" }}>
                  My Courses
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  px: 3,
                  bgcolor: "#f9fafb",
                  borderRadius: 2,
                }}
              >
                <IconBook size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No courses yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your courses will appear here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Profile */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Quick Actions */}
            <Card
              sx={{
                borderRadius: 3,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#1f2937" }}>
                  Quick Actions
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<IconBook size={20} />}
                  sx={{
                    py: 1.5,
                    bgcolor: "#8b5cf6",
                    "&:hover": { bgcolor: "#7c3aed" },
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Manage Courses
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card
              sx={{
                borderRadius: 3,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#1f2937" }}>
                  Profile Summary
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Institution
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {professorDetails?.collegeUniversityName || "Not set"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#e5e7eb" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Department
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {professorDetails?.subjectDepartment || "Not set"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#e5e7eb" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Experience
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {professorDetails?.yearsOfTeachingExperience || "Not set"}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderColor: "#8b5cf6",
                    color: "#8b5cf6",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#7c3aed",
                      bgcolor: "#f5f3ff",
                    },
                  }}
                  onClick={() => {
                    console.log("Edit profile");
                  }}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessorDashboard;

