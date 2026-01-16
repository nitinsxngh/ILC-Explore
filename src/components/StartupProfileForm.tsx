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
import { IconRocket, IconCheck, IconUpload } from "@tabler/icons-react";

interface StartupProfileFormProps {
  open: boolean;
  onSubmit: (data: StartupFormData) => Promise<void>;
  userEmail?: string;
}

export interface StartupFormData {
  founderName: string;
  email: string;
  mobileNumber: string;
  startupName: string;
  stageOfStartup: string;
  industryDomain: string;
  websiteUrl: string;
  linkedinUrl: string;
  city: string;
  state: string;
  fullAddress: string;
  gstNumber: string;
  incorporationDetails: string;
  msmeCertificate?: File | null;
  startupIndiaCertificate?: File | null;
}

const StartupProfileForm: React.FC<StartupProfileFormProps> = ({
  open,
  onSubmit,
  userEmail,
}) => {
  const [formData, setFormData] = useState<StartupFormData>({
    founderName: "",
    email: userEmail || "",
    mobileNumber: "",
    startupName: "",
    stageOfStartup: "",
    industryDomain: "",
    websiteUrl: "",
    linkedinUrl: "",
    city: "",
    state: "",
    fullAddress: "",
    gstNumber: "",
    incorporationDetails: "",
    msmeCertificate: null,
    startupIndiaCertificate: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StartupFormData, string>>>({});

  const handleChange = (field: keyof StartupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (field: "msmeCertificate" | "startupIndiaCertificate") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StartupFormData, string>> = {};

    if (!formData.founderName.trim()) newErrors.founderName = "Founder name is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    if (!formData.startupName.trim()) newErrors.startupName = "Startup name is required";
    if (!formData.stageOfStartup) newErrors.stageOfStartup = "Stage of startup is required";
    if (!formData.industryDomain.trim()) newErrors.industryDomain = "Industry domain is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required";
    if (!formData.gstNumber.trim()) newErrors.gstNumber = "GST number is required";
    if (!formData.incorporationDetails.trim()) {
      newErrors.incorporationDetails = "Incorporation details are required";
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
      console.error("Error submitting startup form:", error);
    } finally {
      setLoading(false);
    }
  };

  const stages = ["Idea", "MVP", "Revenue"];
  const industryDomains = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Agriculture",
    "Real Estate",
    "Other",
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
          background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
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
                bgcolor: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <IconRocket size={32} color="#10b981" />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1f2937", mb: 1 }}>
              Startup Profile Setup
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Please complete your profile to continue
            </Typography>
          </Box>

          {/* Founder Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              1. Founder Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Founder Name"
                  value={formData.founderName}
                  onChange={handleChange("founderName")}
                  error={!!errors.founderName}
                  helperText={errors.founderName}
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

          {/* Startup Information */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              2. Startup Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Startup Name"
                  value={formData.startupName}
                  onChange={handleChange("startupName")}
                  error={!!errors.startupName}
                  helperText={errors.startupName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Stage of Startup"
                  value={formData.stageOfStartup}
                  onChange={handleChange("stageOfStartup")}
                  error={!!errors.stageOfStartup}
                  helperText={errors.stageOfStartup}
                  required
                >
                  {stages.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Industry Domain"
                  value={formData.industryDomain}
                  onChange={handleChange("industryDomain")}
                  error={!!errors.industryDomain}
                  helperText={errors.industryDomain}
                  required
                >
                  {industryDomains.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website URL"
                  value={formData.websiteUrl}
                  onChange={handleChange("websiteUrl")}
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={formData.linkedinUrl}
                  onChange={handleChange("linkedinUrl")}
                  placeholder="https://linkedin.com/company/example"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Business Address */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              3. Business Address
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Full Address"
                  value={formData.fullAddress}
                  onChange={handleChange("fullAddress")}
                  error={!!errors.fullAddress}
                  helperText={errors.fullAddress}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Legal & Registration Details */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: "#1f2937" }}>
              4. Legal & Registration Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="GST Number"
                  value={formData.gstNumber}
                  onChange={handleChange("gstNumber")}
                  error={!!errors.gstNumber}
                  helperText={errors.gstNumber}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Incorporation Details"
                  value={formData.incorporationDetails}
                  onChange={handleChange("incorporationDetails")}
                  error={!!errors.incorporationDetails}
                  helperText={errors.incorporationDetails}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight={600} mb={1}>
                    MSME Registration Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<IconUpload size={18} />}
                    fullWidth
                  >
                    {formData.msmeCertificate ? formData.msmeCertificate.name : "Upload Certificate"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange("msmeCertificate")}
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight={600} mb={1}>
                    Startup India Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<IconUpload size={18} />}
                    fullWidth
                  >
                    {formData.startupIndiaCertificate
                      ? formData.startupIndiaCertificate.name
                      : "Upload Certificate"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange("startupIndiaCertificate")}
                    />
                  </Button>
                </Box>
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
              bgcolor: "#10b981",
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            {loading ? "Saving..." : "Save & Continue to Dashboard"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StartupProfileForm;

