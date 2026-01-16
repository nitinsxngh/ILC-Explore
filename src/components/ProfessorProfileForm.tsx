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
import { IconUserCircle, IconCheck } from "@tabler/icons-react";

interface ProfessorProfileFormProps {
  open: boolean;
  onSubmit: (data: ProfessorFormData) => Promise<void>;
  userEmail?: string;
}

export interface ProfessorFormData {
  fullName: string;
  institutionalEmail: string;
  mobileNumber: string;
  collegeUniversityName: string;
  subjectDepartment: string;
  yearsOfTeachingExperience: string;
  linkedinUrl: string;
}

const ProfessorProfileForm: React.FC<ProfessorProfileFormProps> = ({
  open,
  onSubmit,
  userEmail,
}) => {
  const [formData, setFormData] = useState<ProfessorFormData>({
    fullName: "",
    institutionalEmail: userEmail || "",
    mobileNumber: "",
    collegeUniversityName: "",
    subjectDepartment: "",
    yearsOfTeachingExperience: "",
    linkedinUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfessorFormData, string>>>({});

  const handleChange = (field: keyof ProfessorFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfessorFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    if (!formData.collegeUniversityName.trim()) {
      newErrors.collegeUniversityName = "College/University name is required";
    }
    if (!formData.subjectDepartment.trim()) {
      newErrors.subjectDepartment = "Subject/Department is required";
    }
    if (!formData.yearsOfTeachingExperience) {
      newErrors.yearsOfTeachingExperience = "Years of teaching experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting professor form:", error);
    } finally {
      setLoading(false);
    }
  };

  const teachingExperienceOptions = [
    "1-5 Years",
    "6-10 Years",
    "11-15 Years",
    "16-20 Years",
    "21-25 Years",
    "26-30 Years",
    "30+ Years",
  ];

  return (
    <Dialog open={open} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)",
          borderRadius: "12px 12px 0 0",
        }}
      />
      <DialogContent sx={{ p: 4, pt: 5, overflowY: "auto" }}>
        <Stack spacing={3}>
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
              <IconUserCircle size={32} color="#8b5cf6" />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1f2937", mb: 1 }}>
              Professor Profile Setup
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Please complete your profile to continue
            </Typography>
          </Box>

          {/* Personal Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              1. Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  label="Institutional Email"
                  value={formData.institutionalEmail}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange("mobileNumber")}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Academic Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              2. Academic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College / University Name"
                  value={formData.collegeUniversityName}
                  onChange={handleChange("collegeUniversityName")}
                  error={!!errors.collegeUniversityName}
                  helperText={errors.collegeUniversityName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subject / Department"
                  value={formData.subjectDepartment}
                  onChange={handleChange("subjectDepartment")}
                  error={!!errors.subjectDepartment}
                  helperText={errors.subjectDepartment}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Years of Teaching Experience"
                  value={formData.yearsOfTeachingExperience}
                  onChange={handleChange("yearsOfTeachingExperience")}
                  error={!!errors.yearsOfTeachingExperience}
                  helperText={errors.yearsOfTeachingExperience}
                  required
                >
                  {teachingExperienceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Professional Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              3. Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile URL"
                  value={formData.linkedinUrl}
                  onChange={handleChange("linkedinUrl")}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <IconCheck size={20} />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: "#8b5cf6",
              "&:hover": { bgcolor: "#7c3aed" },
            }}
          >
            {loading ? "Saving..." : "Save & Continue to Dashboard"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessorProfileForm;

