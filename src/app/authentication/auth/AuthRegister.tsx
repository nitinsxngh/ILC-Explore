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
  Divider,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useAuth } from '@/contexts/AuthContext';
import { IconBrandGoogle } from '@tabler/icons-react';

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
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Name is required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.push('Please enter a valid email');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Registration form submitted with:', formData);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      console.log('Attempting to register user...');
      await signUp(formData.email, formData.password, formData.name);
      console.log('Registration successful, redirecting...');
      router.push('/'); // Redirect to dashboard after successful registration
    } catch (error: any) {
      console.error('Registration failed:', error);
      setErrors([error.message || 'Registration failed. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors([]);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error: any) {
      setErrors([error.message || 'Google login failed. Please try again.']);
    } finally {
      setGoogleLoading(false);
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

          {errors.length > 0 && (
            <Stack spacing={1}>
              {errors.map((error, index) => (
                <Alert severity="error" key={index}>{error}</Alert>
              ))}
            </Stack>
          )}
        </Stack>

        <Button 
          type="submit" 
          color="primary" 
          variant="contained" 
          size="large" 
          fullWidth
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Box>

      {/* Divider */}
      <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Google Login Button */}
      <Box>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          startIcon={<IconBrandGoogle size={20} />}
          sx={{
            borderColor: '#dadce0',
            color: '#3c4043',
            '&:hover': {
              borderColor: '#dadce0',
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          {googleLoading ? "Signing in with Google..." : "Continue with Google"}
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
