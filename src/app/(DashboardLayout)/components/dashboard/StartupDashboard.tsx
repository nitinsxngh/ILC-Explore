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
  IconBuilding,
  IconTrendingUp,
  IconStar,
  IconArrowUpRight,
  IconRocket,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const StartupDashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const startupDetails = profile?.startupDetails;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mock stats - can be replaced with actual data
  const stats = {
    totalEmployees: 0,
    activeProjects: 0,
    totalFunding: 0,
    averageRating: 4.5,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Welcome Banner - Startup Style */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                Welcome, {startupDetails?.founderName || user?.displayName || "Founder"}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {startupDetails?.startupName || "Your Startup"}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={startupDetails?.stageOfStartup || "Startup"}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={startupDetails?.industryDomain || "Industry"}
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
              {startupDetails?.startupName?.charAt(0) || user?.displayName?.charAt(0) || "S"}
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
                    {stats.totalEmployees}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e3a8a", fontWeight: 500 }}>
                    Total Employees
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
                    {stats.activeProjects}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 500 }}>
                    Active Projects
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
                  <IconRocket size={28} />
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
                    ₹{stats.totalFunding.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f46e5", fontWeight: 500 }}>
                    Total Funding
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
        {/* Recent Activity */}
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
                  Recent Activity
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
                <IconBuilding size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No activity yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your startup activities will appear here
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
                  startIcon={<IconRocket size={20} />}
                  sx={{
                    py: 1.5,
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Manage Startup
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
                      Stage
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {startupDetails?.stageOfStartup || "Not set"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#e5e7eb" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Industry
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {startupDetails?.industryDomain || "Not set"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#e5e7eb" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#1f2937", mt: 0.5 }}>
                      {startupDetails?.city && startupDetails?.state
                        ? `${startupDetails.city}, ${startupDetails.state}`
                        : "Not set"}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderColor: "#10b981",
                    color: "#10b981",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#059669",
                      bgcolor: "#ecfdf5",
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

export default StartupDashboard;

