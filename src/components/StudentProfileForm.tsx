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
  Checkbox,
} from "@mui/material";
import { IconLock, IconCheck } from "@tabler/icons-react";

interface StudentProfileFormProps {
  open: boolean;
  onSubmit: (data: StudentFormData) => Promise<void>;
  userEmail?: string;
}

export interface StudentFormData {
  fullName: string;
  age: string;
  email: string;
  mobileNumber: string;
  parentName: string;
  parentEmail: string;
  parentMobileNumber: string;
  collegeName: string;
  courseDegree: string;
  yearOfStudy: string;
  incomeGroup: string;
  category: "EWS" | "General" | "";
  ewsVerificationNumber?: string;
}

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  open,
  onSubmit,
  userEmail,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: "",
    age: "",
    email: userEmail || "",
    mobileNumber: "",
    parentName: "",
    parentEmail: "",
    parentMobileNumber: "",
    collegeName: "",
    courseDegree: "",
    yearOfStudy: "",
    incomeGroup: "",
    category: "",
    ewsVerificationNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  const handleChange = (field: keyof StudentFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    if (!formData.parentName.trim()) newErrors.parentName = "Parent name is required";
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Parent email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Invalid email format";
    }
    if (!formData.parentMobileNumber.trim()) {
      newErrors.parentMobileNumber = "Parent mobile number is required";
    }
    if (!formData.collegeName.trim()) newErrors.collegeName = "College name is required";
    if (!formData.courseDegree.trim()) newErrors.courseDegree = "Course/Degree is required";
    if (!formData.yearOfStudy.trim()) newErrors.yearOfStudy = "Year of study is required";
    if (!formData.incomeGroup.trim()) newErrors.incomeGroup = "Income group is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.category === "EWS" && !formData.ewsVerificationNumber?.trim()) {
      newErrors.ewsVerificationNumber = "EWS verification number is required";
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
      console.error("Error submitting student form:", error);
    } finally {
      setLoading(false);
    }
  };

  const incomeGroups = [
    "Below ₹2.5 Lakhs",
    "₹2.5 - ₹5 Lakhs",
    "₹5 - ₹10 Lakhs",
    "₹10 - ₹20 Lakhs",
    "Above ₹20 Lakhs",
  ];

  const yearsOfStudy = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Post Graduate"];

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
              <IconLock size={32} color="#6366f1" />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1f2937", mb: 1 }}>
              Student Profile Setup
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
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange("age")}
                  error={!!errors.age}
                  helperText={errors.age}
                  required
                  inputProps={{ min: 1, max: 100 }}
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

          {/* Parent/Guardian Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              2. Parent / Guardian Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Parent&apos;s Name"
                  value={formData.parentName}
                  onChange={handleChange("parentName")}
                  error={!!errors.parentName}
                  helperText={errors.parentName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent&apos;s Email"
                  type="email"
                  value={formData.parentEmail}
                  onChange={handleChange("parentEmail")}
                  error={!!errors.parentEmail}
                  helperText={errors.parentEmail}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent&apos;s Mobile Number"
                  value={formData.parentMobileNumber}
                  onChange={handleChange("parentMobileNumber")}
                  error={!!errors.parentMobileNumber}
                  helperText={errors.parentMobileNumber}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Academic Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              3. Academic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College / Institute Name"
                  value={formData.collegeName}
                  onChange={handleChange("collegeName")}
                  error={!!errors.collegeName}
                  helperText={errors.collegeName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course / Degree"
                  value={formData.courseDegree}
                  onChange={handleChange("courseDegree")}
                  error={!!errors.courseDegree}
                  helperText={errors.courseDegree}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Year of Study"
                  value={formData.yearOfStudy}
                  onChange={handleChange("yearOfStudy")}
                  error={!!errors.yearOfStudy}
                  helperText={errors.yearOfStudy}
                  required
                >
                  {yearsOfStudy.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Economic & Category Details */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              4. Economic & Category Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Income Group"
                  value={formData.incomeGroup}
                  onChange={handleChange("incomeGroup")}
                  error={!!errors.incomeGroup}
                  helperText={errors.incomeGroup}
                  required
                >
                  {incomeGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" error={!!errors.category} required>
                  <FormLabel component="legend">Category</FormLabel>
                  <RadioGroup
                    row
                    value={formData.category}
                    onChange={(e) => handleChange("category")(e as any)}
                  >
                    <FormControlLabel value="EWS" control={<Radio />} label="EWS" />
                    <FormControlLabel value="General" control={<Radio />} label="General" />
                  </RadioGroup>
                  {errors.category && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {formData.category === "EWS" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="EWS Verification Number"
                    value={formData.ewsVerificationNumber}
                    onChange={handleChange("ewsVerificationNumber")}
                    error={!!errors.ewsVerificationNumber}
                    helperText={errors.ewsVerificationNumber}
                    required
                  />
                </Grid>
              )}
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

export default StudentProfileForm;

