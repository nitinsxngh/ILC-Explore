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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from "@mui/material";
import { IconUser, IconCheck } from "@tabler/icons-react";

interface MentorProfileFormProps {
  open: boolean;
  onSubmit: (data: MentorFormData) => Promise<void>;
  userEmail?: string;
}

export interface MentorFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  currentRole: string;
  organization: string;
  yearsOfExperience: string;
  areasOfExpertise: string[];
  city: string;
  state: string;
  currentlyWorking: boolean;
  totalYearsOfExperience: string;
  linkedinUrl: string;
}

const MentorProfileForm: React.FC<MentorProfileFormProps> = ({
  open,
  onSubmit,
  userEmail,
}) => {
  const [formData, setFormData] = useState<MentorFormData>({
    fullName: "",
    email: userEmail || "",
    mobileNumber: "",
    currentRole: "",
    organization: "",
    yearsOfExperience: "",
    areasOfExpertise: [],
    city: "",
    state: "",
    currentlyWorking: true,
    totalYearsOfExperience: "",
    linkedinUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MentorFormData, string>>>({});
  const [expertiseInput, setExpertiseInput] = useState("");

  const handleChange = (field: keyof MentorFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleExpertiseAdd = () => {
    if (expertiseInput.trim() && !formData.areasOfExpertise.includes(expertiseInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        areasOfExpertise: [...prev.areasOfExpertise, expertiseInput.trim()],
      }));
      setExpertiseInput("");
    }
  };

  const handleExpertiseRemove = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((e) => e !== expertise),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MentorFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    if (!formData.currentRole.trim()) newErrors.currentRole = "Current role is required";
    if (!formData.organization.trim()) newErrors.organization = "Organization is required";
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required";
    if (formData.areasOfExpertise.length === 0) {
      newErrors.areasOfExpertise = "At least one area of expertise is required";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.totalYearsOfExperience.trim()) {
      newErrors.totalYearsOfExperience = "Total years of experience is required";
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

  const totalExperienceOptions = [
    "1-5 Years",
    "6-10 Years",
    "11-15 Years",
    "16-20 Years",
    "21-25 Years",
    "26-30 Years",
    "30+ Years",
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Puducherry", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
    "Daman and Diu", "Lakshadweep",
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
          background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
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
              <IconUser size={32} color="#6366f1" />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1f2937", mb: 1 }}>
              Mentor Profile Setup
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
                  label="Email"
                  value={formData.email}
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

          {/* Professional Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              2. Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Role / Designation"
                  value={formData.currentRole}
                  onChange={handleChange("currentRole")}
                  error={!!errors.currentRole}
                  helperText={errors.currentRole}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization / Company Name"
                  value={formData.organization}
                  onChange={handleChange("organization")}
                  error={!!errors.organization}
                  helperText={errors.organization}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Years of Experience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange("yearsOfExperience")}
                  error={!!errors.yearsOfExperience}
                  helperText={errors.yearsOfExperience}
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
                <Box>
                  <TextField
                    fullWidth
                    label="Area(s) of Expertise"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleExpertiseAdd();
                      }
                    }}
                    error={!!errors.areasOfExpertise}
                    helperText={errors.areasOfExpertise || "Type and press Enter to add"}
                    required
                  />
                  <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.areasOfExpertise.map((expertise) => (
                      <Chip
                        key={expertise}
                        label={expertise}
                        onDelete={() => handleExpertiseRemove(expertise)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Work Location & Status */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              3. Work Location & Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleChange("city")}
                  error={!!errors.city}
                  helperText={errors.city}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="State"
                  value={formData.state}
                  onChange={handleChange("state")}
                  error={!!errors.state}
                  helperText={errors.state}
                  required
                >
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Currently Working</FormLabel>
                  <RadioGroup
                    row
                    value={formData.currentlyWorking.toString()}
                    onChange={(e) =>
                      handleChange("currentlyWorking")({
                        target: { value: e.target.value === "true" },
                      } as any)
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Total Years of Experience"
                  value={formData.totalYearsOfExperience}
                  onChange={handleChange("totalYearsOfExperience")}
                  error={!!errors.totalYearsOfExperience}
                  helperText={errors.totalYearsOfExperience}
                  required
                >
                  {totalExperienceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Online Presence */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              4. Online Presence
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
              bgcolor: "#6366f1",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            {loading ? "Saving..." : "Save & Continue to Dashboard"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MentorProfileForm;

