import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Divider,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useAuth } from '@/contexts/AuthContext';
import { IconBrandGoogle } from '@tabler/icons-react';
import { auth } from '@/lib/firebase';

interface RegisterProps {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  role: "student" | "startup" | "mentor" | "professor";
}

type UserRole = "student" | "startup" | "mentor" | "professor";

const AuthRegister: React.FC<RegisterProps> = ({ title, subtitle, subtext, role: initialRole }) => {
  // Registration method: 'google' or 'email'
  const [registrationMethod, setRegistrationMethod] = useState<'google' | 'email' | null>(null);
  
  // Basic auth fields (only for email registration)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role state - can be changed by user
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || "student");
  
  // Role-specific form data
  const [roleData, setRoleData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");
  
  const router = useRouter();
  const { signUp, signInWithGoogle, user } = useAuth();

  // Initialize role-specific data when role changes
  React.useEffect(() => {
    // Reset form data when role changes
    setRoleData({});
    setErrors({});
    setExpertiseInput("");
    
    if (selectedRole === "student") {
      setRoleData({
        fullName: "",
        age: "",
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
    } else if (selectedRole === "startup") {
      setRoleData({
        founderName: "",
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
      });
    } else if (selectedRole === "mentor") {
      setRoleData({
        fullName: "",
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
    } else if (selectedRole === "professor") {
      setRoleData({
        fullName: "",
        mobileNumber: "",
        collegeUniversityName: "",
        subjectDepartment: "",
        yearsOfTeachingExperience: "",
        linkedinUrl: "",
      });
    }
  }, [selectedRole]);

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
  };

  const handleRoleDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setRoleData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleExpertiseAdd = () => {
    if (expertiseInput.trim() && !roleData.areasOfExpertise?.includes(expertiseInput.trim())) {
      setRoleData((prev: any) => ({
        ...prev,
        areasOfExpertise: [...(prev.areasOfExpertise || []), expertiseInput.trim()],
      }));
      setExpertiseInput("");
    }
  };

  const handleExpertiseRemove = (expertise: string) => {
    setRoleData((prev: any) => ({
      ...prev,
      areasOfExpertise: (prev.areasOfExpertise || []).filter((e: string) => e !== expertise),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Basic validation - only required for email registration
    if (registrationMethod === 'email') {
      if (!email.trim() || !emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Role-specific validation
    if (selectedRole === "student") {
      if (!roleData.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!roleData.age?.trim()) newErrors.age = "Age is required";
      if (!roleData.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      if (!roleData.parentName?.trim()) newErrors.parentName = "Parent name is required";
      if (!roleData.parentEmail?.trim()) {
        newErrors.parentEmail = "Parent email is required";
      } else if (!emailRegex.test(roleData.parentEmail)) {
        newErrors.parentEmail = "Invalid email format";
      }
      if (!roleData.parentMobileNumber?.trim()) newErrors.parentMobileNumber = "Parent mobile number is required";
      if (!roleData.collegeName?.trim()) newErrors.collegeName = "College name is required";
      if (!roleData.courseDegree?.trim()) newErrors.courseDegree = "Course/Degree is required";
      if (!roleData.yearOfStudy?.trim()) newErrors.yearOfStudy = "Year of study is required";
      if (!roleData.incomeGroup?.trim()) newErrors.incomeGroup = "Income group is required";
      if (!roleData.category) newErrors.category = "Category is required";
      if (roleData.category === "EWS" && !roleData.ewsVerificationNumber?.trim()) {
        newErrors.ewsVerificationNumber = "EWS verification number is required";
      }
    } else if (selectedRole === "startup") {
      if (!roleData.founderName?.trim()) newErrors.founderName = "Founder name is required";
      if (!roleData.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      if (!roleData.startupName?.trim()) newErrors.startupName = "Startup name is required";
      if (!roleData.stageOfStartup) newErrors.stageOfStartup = "Stage of startup is required";
      if (!roleData.industryDomain?.trim()) newErrors.industryDomain = "Industry domain is required";
      if (!roleData.city?.trim()) newErrors.city = "City is required";
      if (!roleData.state?.trim()) newErrors.state = "State is required";
      if (!roleData.fullAddress?.trim()) newErrors.fullAddress = "Full address is required";
      if (!roleData.gstNumber?.trim()) newErrors.gstNumber = "GST number is required";
      if (!roleData.incorporationDetails?.trim()) newErrors.incorporationDetails = "Incorporation details are required";
    } else if (selectedRole === "mentor") {
      if (!roleData.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!roleData.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      if (!roleData.currentRole?.trim()) newErrors.currentRole = "Current role is required";
      if (!roleData.organization?.trim()) newErrors.organization = "Organization is required";
      if (!roleData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required";
      if (!roleData.areasOfExpertise || roleData.areasOfExpertise.length === 0) {
        newErrors.areasOfExpertise = "At least one area of expertise is required";
      }
      if (!roleData.city?.trim()) newErrors.city = "City is required";
      if (!roleData.state?.trim()) newErrors.state = "State is required";
      if (!roleData.totalYearsOfExperience?.trim()) {
        newErrors.totalYearsOfExperience = "Total years of experience is required";
      }
    } else if (selectedRole === "professor") {
      if (!roleData.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!roleData.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      if (!roleData.collegeUniversityName?.trim()) {
        newErrors.collegeUniversityName = "College/University name is required";
      }
      if (!roleData.subjectDepartment?.trim()) {
        newErrors.subjectDepartment = "Subject/Department is required";
      }
      if (!roleData.yearsOfTeachingExperience) {
        newErrors.yearsOfTeachingExperience = "Years of teaching experience is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!registrationMethod) {
      setErrors({ submit: 'Please select a registration method (Email or Google)' });
      return;
    }

    if (registrationMethod === 'email') {
      if (!validateForm()) {
        return;
      }
    } else {
      // For Google, validation is handled in handleGoogleLogin
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create user account with email/password
      await signUp(email, password, roleData.fullName || roleData.founderName || "");
      
      // Wait for auth state to update
      let currentUser = auth.currentUser;
      let attempts = 0;
      while (!currentUser && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentUser = auth.currentUser;
        attempts++;
      }

      if (!currentUser) {
        throw new Error("User creation failed. Please try again.");
      }

      // Prepare profile data based on role
      let profileData: any = {
        userId: currentUser.uid,
        role: selectedRole,
      };

      if (selectedRole === "student") {
        profileData.studentDetails = {
          ...roleData,
          email: email,
          completed: true,
        };
      } else if (selectedRole === "startup") {
        profileData.startupDetails = {
          ...roleData,
          email: email,
          completed: true,
        };
      } else if (selectedRole === "mentor") {
        profileData.mentorDetails = {
          ...roleData,
          email: email,
          completed: true,
        };
      } else if (selectedRole === "professor") {
        profileData.professorDetails = {
          ...roleData,
          institutionalEmail: email,
          completed: true,
        };
      }

      // Save profile data
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      // Redirect based on role
      if (selectedRole === "mentor") {
        router.push("/mentor");
      } else if (selectedRole === "startup") {
        router.push("/startup");
      } else if (selectedRole === "professor") {
        router.push("/professor");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = (): boolean => {
    // Check role-specific required fields
    // Email/password only required for email registration method
    if (selectedRole === "student") {
      return !!(
        roleData.fullName?.trim() &&
        roleData.age?.trim() &&
        roleData.mobileNumber?.trim() &&
        roleData.parentName?.trim() &&
        roleData.parentEmail?.trim() &&
        roleData.parentMobileNumber?.trim() &&
        roleData.collegeName?.trim() &&
        roleData.courseDegree?.trim() &&
        roleData.yearOfStudy?.trim() &&
        roleData.incomeGroup?.trim() &&
        roleData.category &&
        (roleData.category !== "EWS" || roleData.ewsVerificationNumber?.trim())
      );
    } else if (selectedRole === "startup") {
      return !!(
        roleData.founderName?.trim() &&
        roleData.mobileNumber?.trim() &&
        roleData.startupName?.trim() &&
        roleData.stageOfStartup &&
        roleData.industryDomain?.trim() &&
        roleData.city?.trim() &&
        roleData.state?.trim() &&
        roleData.fullAddress?.trim() &&
        roleData.gstNumber?.trim() &&
        roleData.incorporationDetails?.trim()
      );
    } else if (selectedRole === "mentor") {
      return !!(
        roleData.fullName?.trim() &&
        roleData.mobileNumber?.trim() &&
        roleData.currentRole?.trim() &&
        roleData.organization?.trim() &&
        roleData.yearsOfExperience &&
        roleData.areasOfExpertise &&
        roleData.areasOfExpertise.length > 0 &&
        roleData.city?.trim() &&
        roleData.state?.trim() &&
        roleData.totalYearsOfExperience?.trim()
      );
    } else if (selectedRole === "professor") {
      return !!(
        roleData.fullName?.trim() &&
        roleData.mobileNumber?.trim() &&
        roleData.collegeUniversityName?.trim() &&
        roleData.subjectDepartment?.trim() &&
        roleData.yearsOfTeachingExperience
      );
    }

    return false;
  };

  const handleGoogleLogin = async () => {
    // Check if role-specific fields are filled
    if (!isFormFilled()) {
      setErrors({ submit: 'Please complete all required profile fields before proceeding.' });
      return;
    }

    setGoogleLoading(true);
    setErrors({});

    try {
      await signInWithGoogle();
      
      // Wait for auth state to update
      let currentUser = auth.currentUser;
      let attempts = 0;
      while (!currentUser && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentUser = auth.currentUser;
        attempts++;
      }

      if (!currentUser) {
        throw new Error("Google sign-in failed. Please try again.");
      }

      // Prepare profile data based on role
      // Always use Google user's email (ignore form email/password when using Google)
      const userEmail = currentUser.email;
      if (!userEmail) {
        throw new Error("Google account email not found. Please try again.");
      }
      let profileData: any = {
        userId: currentUser.uid,
        role: selectedRole,
      };

      if (selectedRole === "student") {
        profileData.studentDetails = {
          ...roleData,
          email: userEmail,
          completed: true,
        };
      } else if (selectedRole === "startup") {
        profileData.startupDetails = {
          ...roleData,
          email: userEmail,
          completed: true,
        };
      } else if (selectedRole === "mentor") {
        profileData.mentorDetails = {
          ...roleData,
          email: userEmail,
          completed: true,
        };
      } else if (selectedRole === "professor") {
        profileData.professorDetails = {
          ...roleData,
          institutionalEmail: userEmail,
          completed: true,
        };
      }

      // Save profile data
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      // Redirect based on role
      if (selectedRole === "mentor") {
        router.push("/mentor");
      } else if (selectedRole === "startup") {
        router.push("/startup");
      } else if (selectedRole === "professor") {
        router.push("/professor");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Google login failed. Please try again.' });
    } finally {
      setGoogleLoading(false);
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
  const stages = ["Idea", "MVP", "Revenue"];
  const industryDomains = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce",
    "Manufacturing", "Agriculture", "Real Estate", "Other",
  ];
  const experienceOptions = [
    "1-3 Years", "4-6 Years", "7-10 Years", "11-15 Years", "16-20 Years", "20+ Years",
  ];
  const totalExperienceOptions = [
    "1-5 Years", "6-10 Years", "11-15 Years", "16-20 Years", "21-25 Years", "26-30 Years", "30+ Years",
  ];
  const teachingExperienceOptions = [
    "1-5 Years", "6-10 Years", "11-15 Years", "16-20 Years", "21-25 Years", "26-30 Years", "30+ Years",
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

  const renderRoleSpecificFields = () => {
    if (selectedRole === "student") {
      return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                value={roleData.fullName || ""}
                onChange={handleRoleDataChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                size="small"
                value={roleData.age || ""}
                onChange={handleRoleDataChange("age")}
                error={!!errors.age}
                helperText={errors.age}
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                size="small"
                value={roleData.mobileNumber || ""}
                onChange={handleRoleDataChange("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Parent&apos;s Name"
                size="small"
                value={roleData.parentName || ""}
                onChange={handleRoleDataChange("parentName")}
                error={!!errors.parentName}
                helperText={errors.parentName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Parent&apos;s Email"
                type="email"
                size="small"
                value={roleData.parentEmail || ""}
                onChange={handleRoleDataChange("parentEmail")}
                error={!!errors.parentEmail}
                helperText={errors.parentEmail}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Parent&apos;s Mobile"
                size="small"
                value={roleData.parentMobileNumber || ""}
                onChange={handleRoleDataChange("parentMobileNumber")}
                error={!!errors.parentMobileNumber}
                helperText={errors.parentMobileNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="College / Institute"
                size="small"
                value={roleData.collegeName || ""}
                onChange={handleRoleDataChange("collegeName")}
                error={!!errors.collegeName}
                helperText={errors.collegeName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course / Degree"
                size="small"
                value={roleData.courseDegree || ""}
                onChange={handleRoleDataChange("courseDegree")}
                error={!!errors.courseDegree}
                helperText={errors.courseDegree}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Year of Study"
                size="small"
                value={roleData.yearOfStudy || ""}
                onChange={handleRoleDataChange("yearOfStudy")}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Income Group"
                size="small"
                value={roleData.incomeGroup || ""}
                onChange={handleRoleDataChange("incomeGroup")}
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
            <Grid item xs={12} md={4}>
              <FormControl component="fieldset" error={!!errors.category} required fullWidth>
                <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Category</FormLabel>
                <RadioGroup
                  row
                  value={roleData.category || ""}
                  onChange={(e) => handleRoleDataChange("category")(e as any)}
                >
                  <FormControlLabel value="EWS" control={<Radio size="small" />} label="EWS" />
                  <FormControlLabel value="General" control={<Radio size="small" />} label="General" />
                </RadioGroup>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            {roleData.category === "EWS" && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="EWS Verification Number"
                  size="small"
                  value={roleData.ewsVerificationNumber || ""}
                  onChange={handleRoleDataChange("ewsVerificationNumber")}
                  error={!!errors.ewsVerificationNumber}
                  helperText={errors.ewsVerificationNumber}
                  required
                />
              </Grid>
            )}
          </Grid>
      );
    } else if (selectedRole === "startup") {
      return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Founder Name"
                size="small"
                value={roleData.founderName || ""}
                onChange={handleRoleDataChange("founderName")}
                error={!!errors.founderName}
                helperText={errors.founderName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                size="small"
                value={roleData.mobileNumber || ""}
                onChange={handleRoleDataChange("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Startup Name"
                size="small"
                value={roleData.startupName || ""}
                onChange={handleRoleDataChange("startupName")}
                error={!!errors.startupName}
                helperText={errors.startupName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Stage of Startup"
                size="small"
                value={roleData.stageOfStartup || ""}
                onChange={handleRoleDataChange("stageOfStartup")}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Industry Domain"
                size="small"
                value={roleData.industryDomain || ""}
                onChange={handleRoleDataChange("industryDomain")}
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
                size="small"
                value={roleData.websiteUrl || ""}
                onChange={handleRoleDataChange("websiteUrl")}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                size="small"
                value={roleData.linkedinUrl || ""}
                onChange={handleRoleDataChange("linkedinUrl")}
                placeholder="https://linkedin.com/company/example"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                size="small"
                value={roleData.city || ""}
                onChange={handleRoleDataChange("city")}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="State"
                size="small"
                value={roleData.state || ""}
                onChange={handleRoleDataChange("state")}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="GST Number"
                size="small"
                value={roleData.gstNumber || ""}
                onChange={handleRoleDataChange("gstNumber")}
                error={!!errors.gstNumber}
                helperText={errors.gstNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Full Address"
                size="small"
                value={roleData.fullAddress || ""}
                onChange={handleRoleDataChange("fullAddress")}
                error={!!errors.fullAddress}
                helperText={errors.fullAddress}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Incorporation Details"
                size="small"
                value={roleData.incorporationDetails || ""}
                onChange={handleRoleDataChange("incorporationDetails")}
                error={!!errors.incorporationDetails}
                helperText={errors.incorporationDetails}
                required
              />
            </Grid>
          </Grid>
      );
    } else if (selectedRole === "mentor") {
      return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                value={roleData.fullName || ""}
                onChange={handleRoleDataChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                size="small"
                value={roleData.mobileNumber || ""}
                onChange={handleRoleDataChange("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Role"
                size="small"
                value={roleData.currentRole || ""}
                onChange={handleRoleDataChange("currentRole")}
                error={!!errors.currentRole}
                helperText={errors.currentRole}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization"
                size="small"
                value={roleData.organization || ""}
                onChange={handleRoleDataChange("organization")}
                error={!!errors.organization}
                helperText={errors.organization}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Years of Experience"
                size="small"
                value={roleData.yearsOfExperience || ""}
                onChange={handleRoleDataChange("yearsOfExperience")}
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Total Years"
                size="small"
                value={roleData.totalYearsOfExperience || ""}
                onChange={handleRoleDataChange("totalYearsOfExperience")}
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
            <Grid item xs={12} md={6}>
              <Box>
                <TextField
                  fullWidth
                  label="Area(s) of Expertise"
                  size="small"
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
                  {(roleData.areasOfExpertise || []).map((expertise: string) => (
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                size="small"
                value={roleData.city || ""}
                onChange={handleRoleDataChange("city")}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="State"
                size="small"
                value={roleData.state || ""}
                onChange={handleRoleDataChange("state")}
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
            <Grid item xs={12} md={4}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Currently Working</FormLabel>
                <RadioGroup
                  row
                  value={roleData.currentlyWorking?.toString() || "true"}
                  onChange={(e) =>
                    handleRoleDataChange("currentlyWorking")({
                      target: { value: e.target.value === "true" },
                    } as any)
                  }
                >
                  <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn Profile URL"
                size="small"
                value={roleData.linkedinUrl || ""}
                onChange={handleRoleDataChange("linkedinUrl")}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </Grid>
          </Grid>
      );
    } else if (selectedRole === "professor") {
      return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                value={roleData.fullName || ""}
                onChange={handleRoleDataChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                size="small"
                value={roleData.mobileNumber || ""}
                onChange={handleRoleDataChange("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Years of Teaching Experience"
                size="small"
                value={roleData.yearsOfTeachingExperience || ""}
                onChange={handleRoleDataChange("yearsOfTeachingExperience")}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="College / University Name"
                size="small"
                value={roleData.collegeUniversityName || ""}
                onChange={handleRoleDataChange("collegeUniversityName")}
                error={!!errors.collegeUniversityName}
                helperText={errors.collegeUniversityName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject / Department"
                size="small"
                value={roleData.subjectDepartment || ""}
                onChange={handleRoleDataChange("subjectDepartment")}
                error={!!errors.subjectDepartment}
                helperText={errors.subjectDepartment}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LinkedIn Profile URL"
                size="small"
                value={roleData.linkedinUrl || ""}
                onChange={handleRoleDataChange("linkedinUrl")}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </Grid>
          </Grid>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {title && <Typography variant="h2" fontWeight="700" mb={1}>{title}</Typography>}
      {subtext}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          {/* Role Selector */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                select
                label="Select Your Role"
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="startup">Startup</MenuItem>
                <MenuItem value="mentor">Mentor</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          {/* Registration Method Selector */}
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Choose Registration Method
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant={registrationMethod === 'email' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => setRegistrationMethod('email')}
                  sx={{
                    py: 1.5,
                    borderColor: registrationMethod === 'email' ? 'primary.main' : '#dadce0',
                    bgcolor: registrationMethod === 'email' ? 'primary.main' : 'transparent',
                    color: registrationMethod === 'email' ? 'white' : '#3c4043',
                    '&:hover': {
                      bgcolor: registrationMethod === 'email' ? 'primary.dark' : '#f8f9fa',
                      borderColor: registrationMethod === 'email' ? 'primary.dark' : '#dadce0',
                    },
                  }}
                >
                  Register with Email
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant={registrationMethod === 'google' ? 'contained' : 'outlined'}
            fullWidth
                  onClick={() => setRegistrationMethod('google')}
                  startIcon={<IconBrandGoogle size={20} />}
                  sx={{
                    py: 1.5,
                    borderColor: registrationMethod === 'google' ? 'primary.main' : '#dadce0',
                    bgcolor: registrationMethod === 'google' ? 'primary.main' : 'transparent',
                    color: registrationMethod === 'google' ? 'white' : '#3c4043',
                    '&:hover': {
                      bgcolor: registrationMethod === 'google' ? 'primary.dark' : '#f8f9fa',
                      borderColor: registrationMethod === 'google' ? 'primary.dark' : '#dadce0',
                    },
                  }}
                >
                  Register with Google
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Email/Password Fields - Only show if email registration is selected */}
          {registrationMethod === 'email' && (
            <>
              <Grid item xs={12} md={4}>
          <CustomTextField
            id="email"
            label="Email Address"
            variant="outlined"
            fullWidth
                  type="email"
                  size="small"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev: any) => ({ ...prev, email: undefined }));
                    }
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
          <CustomTextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
                  size="small"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev: any) => ({ ...prev, password: undefined }));
                    }
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
          <CustomTextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
                  size="small"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev: any) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                />
              </Grid>
            </>
          )}

          {/* Role Specific Fields */}
          <Grid item xs={12}>
            {renderRoleSpecificFields()}
          </Grid>

          {/* Error Message */}
          {errors.submit && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 1 }}>{errors.submit}</Alert>
            </Grid>
          )}

          {/* Submit Button - Different based on registration method */}
          <Grid item xs={12}>
            {registrationMethod === 'email' ? (
        <Button 
          type="submit" 
          color="primary" 
          variant="contained" 
                size="medium" 
          fullWidth
                disabled={loading || !registrationMethod}
                sx={{ mt: 1 }}
        >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
            ) : registrationMethod === 'google' ? (
        <Button
                variant="contained"
                size="medium"
          fullWidth
          onClick={handleGoogleLogin}
                disabled={googleLoading || !isFormFilled() || !registrationMethod}
          startIcon={<IconBrandGoogle size={20} />}
          sx={{
                  mt: 1,
                  bgcolor: '#4285f4',
            '&:hover': {
                    bgcolor: '#357ae8',
                  },
                  '&:disabled': {
                    bgcolor: '#e5e7eb',
                    color: '#9ca3af',
                    cursor: 'not-allowed',
            },
          }}
        >
          {googleLoading ? "Signing in with Google..." : "Continue with Google"}
        </Button>
            ) : (
              <Button 
                variant="outlined"
                size="medium" 
                fullWidth
                disabled
                sx={{ mt: 1 }}
              >
                Please select a registration method above
              </Button>
            )}
            {registrationMethod === 'google' && !isFormFilled() && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 1, 
                  display: "block",
                  textAlign: "center",
                  fontStyle: "italic"
                }}
              >
                Please complete all required profile fields above
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {subtitle}
    </Box>
  );
};

export default AuthRegister;
