"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
  Box,
  Avatar,
} from "@mui/material";
import { IconUser, IconSchool, IconLock, IconRocket, IconUserCircle } from "@tabler/icons-react";

type UserRole = "student" | "startup" | "mentor" | "professor";

interface RoleSelectionModalProps {
  open: boolean;
  onSelectRole: (role: UserRole) => void;
  userName?: string;
  preselectedRole?: string | null;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  open,
  onSelectRole,
  userName,
  preselectedRole,
}) => {
  // Auto-select role if provided - handle both MENTOR and MENTORS
  useEffect(() => {
    if (preselectedRole && open) {
      // Normalize role: remove trailing 'S' if present (MENTORS -> MENTOR)
      const normalizedRole = preselectedRole.toUpperCase().replace(/S$/, "");
      const roleMap: { [key: string]: UserRole } = {
        STUDENT: "student",
        STARTUP: "startup",
        MENTOR: "mentor",
        PROFESSOR: "professor",
      };
      const mappedRole = roleMap[normalizedRole];
      if (mappedRole) {
        // Small delay to ensure modal is rendered
        setTimeout(() => {
          onSelectRole(mappedRole);
        }, 100);
      }
    }
  }, [preselectedRole, open, onSelectRole]);

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          position: "relative",
          overflow: "visible",
        },
      }}
    >
      {/* Gradient Border at Top */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
          borderRadius: "12px 12px 0 0",
        }}
      />

      <DialogContent sx={{ p: 4, pt: 5 }}>
        <Stack spacing={3} alignItems="center">
          {/* Lock Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconLock size={32} color="#6366f1" />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#1f2937", textAlign: "center" }}
          >
            Welcome, {userName || "User"}!
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#6b7280", textAlign: "center" }}
          >
            Please select your role to continue
          </Typography>

          {/* Role Selection Buttons */}
          <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onSelectRole("student")}
              sx={{
                py: 2.5,
                borderRadius: 2,
                borderColor: "#e5e7eb",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#6366f1",
                  borderWidth: 2,
                  bgcolor: "#f5f3ff",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: "#6366f1",
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconSchool size={24} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#1f2937" }}
                  >
                    I&apos;m a Student
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Continue exploring courses and learning
                  </Typography>
                </Box>
              </Stack>
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => onSelectRole("startup")}
              sx={{
                py: 2.5,
                borderRadius: 2,
                borderColor: "#e5e7eb",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#6366f1",
                  borderWidth: 2,
                  bgcolor: "#f5f3ff",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: "#10b981",
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconRocket size={24} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#1f2937" }}
                  >
                    I&apos;m a Startup
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Build and grow your startup
                  </Typography>
                </Box>
              </Stack>
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => onSelectRole("mentor")}
              sx={{
                py: 2.5,
                borderRadius: 2,
                borderColor: "#e5e7eb",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#6366f1",
                  borderWidth: 2,
                  bgcolor: "#f5f3ff",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: "#6366f1",
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconUser size={24} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#1f2937" }}
                  >
                    I&apos;m a Mentor
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Share your expertise and teach students
                  </Typography>
                </Box>
              </Stack>
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => onSelectRole("professor")}
              sx={{
                py: 2.5,
                borderRadius: 2,
                borderColor: "#e5e7eb",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#6366f1",
                  borderWidth: 2,
                  bgcolor: "#f5f3ff",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: "#8b5cf6",
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconUserCircle size={24} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#1f2937" }}
                  >
                    I&apos;m a Professor
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Teach and guide students academically
                  </Typography>
                </Box>
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;

