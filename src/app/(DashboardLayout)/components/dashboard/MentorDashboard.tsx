"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  IconUsers,
  IconBook,
  IconCalendar,
  IconTrendingUp,
  IconStar,
  IconArrowUpRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const MentorDashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const mentorDetails = profile?.mentorDetails;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/courses?mentorId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, fetchCourses]);

  // Calculate stats from actual data
  const totalBookedSeats = courses.reduce((sum, course) => {
    return sum + (course.totalSeats - (course.availableSeats || course.totalSeats));
  }, 0);

  const stats = {
    totalStudents: totalBookedSeats, // Total booked seats across all courses
    activeCourses: courses.length,
    totalRevenue: courses.reduce((sum, course) => {
      const bookedSeats = course.totalSeats - (course.availableSeats || course.totalSeats);
      return sum + (bookedSeats * (course.cost || 0));
    }, 0),
    averageRating: 4.8, // Will be calculated from reviews
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Welcome Banner - Mentor Style */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
                Welcome, {mentorDetails?.fullName || user?.displayName || "Mentor"}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {mentorDetails?.title} at {mentorDetails?.company}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={mentorDetails?.specialization || "Mentor"}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={mentorDetails?.experience || "Experienced"}
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
              {mentorDetails?.fullName?.charAt(0) || user?.displayName?.charAt(0) || "M"}
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
                    {loading ? <CircularProgress size={24} /> : stats.totalStudents}
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
                    {loading ? <CircularProgress size={24} /> : stats.activeCourses}
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
                    {loading ? <CircularProgress size={24} /> : `₹${stats.totalRevenue.toLocaleString()}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 500 }}>
                    Total Revenue
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
                  <IconTrendingUp size={28} />
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
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  href="/mentor/courses"
                  endIcon={<IconArrowUpRight size={16} />}
                  sx={{
                    bgcolor: "#6366f1",
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  Manage All
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : courses.length === 0 ? (
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
                  <Typography variant="body2" color="textSecondary" mb={3}>
                    Create your first course to start mentoring students
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/mentor/courses"
                    sx={{
                      bgcolor: "#6366f1",
                      "&:hover": { bgcolor: "#4f46e5" },
                    }}
                  >
                    Create Course
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {courses.slice(0, 3).map((course) => (
                    <Card
                      key={course._id}
                      sx={{
                        border: "1px solid",
                        borderColor: "#e5e7eb",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#6366f1",
                          boxShadow: "0 2px 8px rgba(99, 102, 241, 0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                              {course.mentorshipTopic}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                              <Chip
                                label={course.classType}
                                size="small"
                                sx={{
                                  bgcolor:
                                    course.classType === "Offline"
                                      ? "#fef3c7"
                                      : course.classType === "Hybrid"
                                      ? "#ede9fe"
                                      : "#dcfce7",
                                  color:
                                    course.classType === "Offline"
                                      ? "#d97706"
                                      : course.classType === "Hybrid"
                                      ? "#6366f1"
                                      : "#16a34a",
                                  fontSize: "0.7rem",
                                  fontWeight: 500,
                                }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                {course.availableSeats}/{course.totalSeats} seats
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: "#6366f1" }}>
                                ₹{course.cost.toLocaleString()}
                              </Typography>
                            </Stack>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            href="/mentor/courses"
                            sx={{
                              borderColor: "#6366f1",
                              color: "#6366f1",
                              "&:hover": {
                                borderColor: "#4f46e5",
                                bgcolor: "#f5f3ff",
                              },
                            }}
                          >
                            View
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  {courses.length > 3 && (
                    <Button
                      fullWidth
                      variant="text"
                      component={Link}
                      href="/mentor/courses"
                      sx={{ color: "#6366f1", fontWeight: 500 }}
                    >
                      View all {courses.length} courses
                    </Button>
                  )}
                </Stack>
              )}
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
                  component={Link}
                  href="/mentor/courses"
                  sx={{
                    py: 1.5,
                    bgcolor: "#6366f1",
                    "&:hover": { bgcolor: "#4f46e5" },
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
                      Specialization
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {mentorDetails?.specialization || "Not set"}
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
                      {mentorDetails?.experience || "Not set"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#e5e7eb" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Company
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {mentorDetails?.company || "Not set"}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderColor: "#6366f1",
                    color: "#6366f1",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#4f46e5",
                      bgcolor: "#f5f3ff",
                    },
                  }}
                  onClick={() => {
                    // Navigate to profile edit page
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

export default MentorDashboard;

