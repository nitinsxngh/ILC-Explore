import React, { useState } from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { ContentCopy } from '@mui/icons-material'; // For the copy icon
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  category: string;
}

const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${randomString}@ilc.limited`;
};

const AuthRegister = ({ title, subtitle, subtext, category }: registerType) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [formError, setFormError] = useState<string[]>([]);
  const [openPopup, setOpenPopup] = useState(false); // State to manage popup visibility
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const errors: string[] = [];

    if (!name.trim()) errors.push('Name is required');

    if (!isGuest) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!email.trim() || !emailRegex.test(email)) errors.push('Please enter a valid email address');
      if (password.length < 6) errors.push('Password must be at least 6 characters');
      if (password !== confirmPassword) errors.push('Passwords do not match');
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm();
    setFormError(errors);
    if (errors.length > 0) return;

    const userData = isGuest
      ? { name, email: generateRandomEmail(), password: '12345678', category }
      : { name, email, password, category };

    try {
      const response = await axios.post('https://api.ilc.limited/api/users/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        console.log('User registered:', response.data);
        if (!isGuest) router.push('/authentication/login');
        
        // Set the registered email and password to show in the popup
        setRegisteredEmail(userData.email);
        setRegisteredPassword(userData.password);
        setOpenPopup(true); // Open the popup
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      setFormError([error.response?.data?.message || 'Something went wrong. Please try again later.']);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false); // Close the popup
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <>
      {title && <Typography fontWeight="700" variant="h2" mb={1}>{title}</Typography>}
      {subtext}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3}>
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">Name</Typography>
          <CustomTextField id="name" variant="outlined" fullWidth value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

          <FormControlLabel
            control={<Checkbox checked={isGuest} onChange={() => setIsGuest(!isGuest)} />}
            label="Register as Guest"
            sx={{ mt: 2 }}
          />

          {!isGuest && (
            <>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">Email Address</Typography>
              <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">Password</Typography>
              <CustomTextField id="password" variant="outlined" type="password" fullWidth value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirmPassword" mb="5px" mt="25px">Confirm Password</Typography>
              <CustomTextField id="confirmPassword" variant="outlined" type="password" fullWidth value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
            </>
          )}

          {formError.length > 0 && (
            <Box sx={{ color: 'error.main', mt: 2 }}>
              {formError.map((err, index) => (
                <Typography key={index} variant="body2">{err}</Typography>
              ))}
            </Box>
          )}
        </Stack>
        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          {isGuest ? 'Register as Guest' : 'Sign Up'}
        </Button>
      </Box>
      {subtitle}

      {/* Popup/Modal to show the email and password after registration */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Registration Successful</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1" fontWeight="bold" flex="1">Your email: {registeredEmail}</Typography>
            <IconButton onClick={() => handleCopyToClipboard(registeredEmail)} color="primary">
              <ContentCopy />
            </IconButton>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1} mt={2}>
            <Typography variant="body1" fontWeight="bold" flex="1">Your password: {registeredPassword}</Typography>
            <IconButton onClick={() => handleCopyToClipboard(registeredPassword)} color="primary">
              <ContentCopy />
            </IconButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
          <Button
            component="a"
            href="/authentication/login"
            target="_blank"
            color="primary"
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthRegister;
