"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  IconX,
  IconStar,
  IconCheck,
  IconRocket,
  IconTarget,
  IconTrendingUp,
} from "@tabler/icons-react";

interface CareerTracksModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTrack: (track: "discovery" | "execution" | "acceleration") => void;
  userName?: string;
}

const CareerTracksModal: React.FC<CareerTracksModalProps> = ({
  open,
  onClose,
  onSelectTrack,
  userName,
}) => {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const tracks = [
    {
      id: "discovery",
      number: "1",
      title: "Career Discovery Track",
      badge: "Best for clarity & Direction",
      badgeIcon: <IconStar size={16} />,
      goal: "Understand your strengths, career fit, build a strong verified resume",
      features: [
        "Psychometric Test & Career Fit Report",
        "Digilocker Verified Resume",
        "Elibrary (Limited)",
        "Internship Listing (view only)",
      ],
      buttonText: "Explore Track",
      buttonColor: "#6366f1",
      icon: <IconTarget size={32} />,
    },
    {
      id: "execution",
      number: "2",
      title: "Career Execution Track",
      badge: "Most Popular",
      badgeIcon: <IconStar size={16} />,
      goal: "Turn clarity into action with internships & placement",
      features: [
        "Everything in Discovery",
        "Structured Interest Internship",
        "Placement Opportunities",
        "Publication",
      ],
      buttonText: "Choose This Track",
      buttonColor: "#10b981",
      icon: <IconRocket size={32} />,
    },
    {
      id: "acceleration",
      number: "3",
      title: "Career Acceleration Track",
      badge: "Fast Track your Career",
      badgeIcon: <IconStar size={16} />,
      goal: "Premium support with priority internship & 1:1 Guidance",
      features: [
        "Everything in Execution",
        "Priority Internship Allocation",
        "1:1 Psychologist Consultation",
        "Resume Verification - Level 2",
        "Internship with Option (1 month)",
      ],
      buttonText: "Upgrade & Accelerate",
      buttonColor: "#f59e0b",
      icon: <IconTrendingUp size={32} />,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: "95vh",
          m: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 10,
            bgcolor: "rgba(0, 0, 0, 0.05)",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <IconX size={20} />
        </IconButton>

        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            p: 4,
            pb: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            }}
          />
          <Stack spacing={1} sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Welcome Back, {userName || "Student"}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, fontSize: { xs: "0.875rem", md: "1rem" } }}>
              Welcome to ILC, Let&apos;s build your career
            </Typography>
          </Stack>
        </Box>

        {/* Tracks Section */}
        <Box sx={{ p: { xs: 2, md: 4 }, pt: 3 }}>
          <Grid container spacing={3}>
            {tracks.map((track) => (
              <Grid item xs={12} md={4} key={track.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "2px solid",
                    borderColor:
                      hoveredTrack === track.id ? track.buttonColor : "#e5e7eb",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px rgba(0, 0, 0, 0.12)`,
                      borderColor: track.buttonColor,
                    },
                    position: "relative",
                    overflow: "visible",
                  }}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                >
                  {/* Track Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -16,
                      left: 20,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: track.buttonColor,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      boxShadow: `0 4px 12px ${track.buttonColor}40`,
                    }}
                  >
                    {track.number}
                  </Box>

                  <CardContent sx={{ p: 3, pt: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Track Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: `${track.buttonColor}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: track.buttonColor,
                        mb: 2,
                      }}
                    >
                      {track.icon}
                    </Box>

                    {/* Title and Badge */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>
                        {track.title}
                      </Typography>
                      <Chip
                        icon={track.badgeIcon}
                        label={track.badge}
                        size="small"
                        sx={{
                          bgcolor: `${track.buttonColor}15`,
                          color: track.buttonColor,
                          fontWeight: 600,
                          width: "fit-content",
                          "& .MuiChip-icon": {
                            color: track.buttonColor,
                          },
                        }}
                      />
                    </Stack>

                    {/* Goal */}
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mb: 3, minHeight: "3rem" }}
                    >
                      {track.goal}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Features List */}
                    <Box sx={{ flex: 1, mb: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          mb: 1.5,
                          display: "block",
                        }}
                      >
                        Includes:
                      </Typography>
                      <Stack spacing={1.5}>
                        {track.features.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                mt: 0.5,
                                minWidth: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: `${track.buttonColor}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <IconCheck
                                size={14}
                                style={{ color: track.buttonColor }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#374151",
                                fontSize: { xs: "0.813rem", md: "0.875rem" },
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => onSelectTrack(track.id as any)}
                      sx={{
                        bgcolor: track.buttonColor,
                        color: "white",
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        "&:hover": {
                          bgcolor: track.buttonColor,
                          opacity: 0.9,
                          transform: "scale(1.02)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {track.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CareerTracksModal;

