"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import { IconLock, IconCheck } from "@tabler/icons-react";

interface MentorOnboardingFormProps {
  open: boolean;
  onSubmit: (data: MentorFormData) => Promise<void>;
  onCancel?: () => void;
}

export interface MentorFormData {
  fullName: string;
  title: string;
  experience: string;
  company: string;
  specialization: string;
  bio: string;
  email: string;
  phone?: string;
  linkedin?: string;
}

const MentorOnboardingForm: React.FC<MentorOnboardingFormProps> = ({
  open,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<MentorFormData>({
    fullName: "",
    title: "",
    experience: "",
    company: "",
    specialization: "",
    bio: "",
    email: "",
    phone: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MentorFormData, string>>>({});

  const handleChange = (field: keyof MentorFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MentorFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting mentor form:", error);
    } finally {
      setLoading(false);
    }
  };

  const experienceOptions = [
    "1-3 Years",
    "4-6 Years",
    "7-10 Years",
    "11-15 Years",
    "16-20 Years",
    "20+ Years",
  ];

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          position: "relative",
          overflow: "visible",
          maxHeight: "90vh",
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

      <DialogContent sx={{ p: 4, pt: 5, overflowY: "auto" }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <IconLock size={32} color="#6366f1" />
            </Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: "#1f2937", mb: 1 }}
            >
              Mentor Profile Setup
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Please provide your details to complete your mentor profile
            </Typography>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Professional Title"
                value={formData.title}
                onChange={handleChange("title")}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="e.g., Senior Associate, Partner, VP"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Years of Experience"
                value={formData.experience}
                onChange={handleChange("experience")}
                error={!!errors.experience}
                helperText={errors.experience}
                required
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company/Organization"
                value={formData.company}
                onChange={handleChange("company")}
                error={!!errors.company}
                helperText={errors.company}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialization"
                value={formData.specialization}
                onChange={handleChange("specialization")}
                error={!!errors.specialization}
                helperText={errors.specialization}
                placeholder="e.g., Corporate Law, Machine Learning, Finance"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone (Optional)"
                value={formData.phone}
                onChange={handleChange("phone")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LinkedIn Profile (Optional)"
                value={formData.linkedin}
                onChange={handleChange("linkedin")}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={formData.bio}
                onChange={handleChange("bio")}
                error={!!errors.bio}
                helperText={errors.bio || "Tell us about your background and expertise"}
                required
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                fullWidth
                onClick={onCancel}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#e5e7eb",
                  color: "#1f2937",
                  "&:hover": {
                    borderColor: "#d1d5db",
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              fullWidth={!onCancel}
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <IconCheck size={20} />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                bgcolor: "#6366f1",
                "&:hover": {
                  bgcolor: "#4f46e5",
                },
              }}
            >
              {loading ? "Submitting..." : "Complete Setup"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MentorOnboardingForm;

