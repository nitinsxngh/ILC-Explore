import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';

interface RegisterProps {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  category: string;
}

const generateRandomEmail = () => `${Math.random().toString(36).substring(2, 10)}@ilc.limited`;

const AuthRegister: React.FC<RegisterProps> = ({ title, subtitle, subtext, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isGuest, setIsGuest] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [popupData, setPopupData] = useState<{ email: string; password: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Name is required');

    if (isGuest) {
      if (!formData.phone.trim()) newErrors.push('Phone number is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.push('Please enter a valid email');
      if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
      if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');
    }

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    const userData = isGuest
      ? { name: formData.name, phone: formData.phone, email: generateRandomEmail(), password: '12345678', category }
      : { ...formData, category };

    try {
      const response = await axios.post('https://api.ilc.limited/api/users/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        console.log('User registered:', response.data);
        setPopupData({ email: userData.email, password: userData.password });
        if (!isGuest) router.push('/authentication/login');
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      setErrors([error.response?.data?.message || 'Something went wrong. Try again later.']);
    }
  };

  return (
    <>
      {title && <Typography variant="h2" fontWeight="700" mb={1}>{title}</Typography>}
      {subtext}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3} spacing={2}>
          <CustomTextField
            id="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />

          <FormControlLabel
            control={<Checkbox checked={isGuest} onChange={() => setIsGuest(!isGuest)} />}
            label="Register as Guest"
          />

          {isGuest ? (
            <CustomTextField
              id="phone"
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
            />
          ) : (
            <>
              <CustomTextField
                id="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />

              <CustomTextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
              />

              <CustomTextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </>
          )}

          {errors.length > 0 && (
            <Stack spacing={1}>
              {errors.map((error, index) => (
                <Alert severity="error" key={index}>{error}</Alert>
              ))}
            </Stack>
          )}
        </Stack>

        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          {isGuest ? 'Register as Guest' : 'Sign Up'}
        </Button>
      </Box>

      {subtitle}

      {/* Success Popup */}
      <Dialog open={!!popupData} onClose={() => setPopupData(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Registration Successful</DialogTitle>
        <DialogContent>
          {popupData && (
            <>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1" fontWeight="bold">Email: {popupData.email}</Typography>
                <IconButton onClick={() => navigator.clipboard.writeText(popupData.email)} color="primary">
                  <ContentCopy />
                </IconButton>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Typography variant="body1" fontWeight="bold">Password: {popupData.password}</Typography>
                <IconButton onClick={() => navigator.clipboard.writeText(popupData.password)} color="primary">
                  <ContentCopy />
                </IconButton>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopupData(null)} color="primary">Close</Button>
          <Button href="/authentication/login" color="primary">Login</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthRegister;
