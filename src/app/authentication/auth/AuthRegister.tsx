import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  category: string;
}

const AuthRegister = ({ title, subtitle, subtext, category }: registerType) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState<string[]>([]);
  const router = useRouter(); // To redirect after successful registration

  const validateForm = () => {
    const errors: string[] = [];

    // Validate Name
    if (!name.trim()) {
      errors.push('Name is required');
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.trim() || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate Password
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateForm();
    setFormError(errors);

    if (errors.length === 0) {
      setError('');
      const userData = { name, email, password, category };

      try {
        // API call for user registration
        const response = await axios.post('https://api.ilc.limited/api/users/register', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle success
        if (response.status === 201) {
          console.log('User registered:', response.data);
          // Redirect to login page after successful registration
          router.push('/authentication/login');
        }
      } catch (error: any) {
        // Handle error if registration fails
        console.error('Error registering user:', error);
        if (error.response && error.response.data) {
          setFormError([error.response.data.message || 'Something went wrong. Please try again later.']);
        } else {
          setFormError(['Something went wrong. Please try again later.']);
        }
      }
    }
  };

  // Explicitly typing the event parameter as React.ChangeEvent<HTMLInputElement>
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3}>
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
            Name
          </Typography>
          <CustomTextField
            id="name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
            Email Address
          </Typography>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField
            id="password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirmPassword" mb="5px" mt="25px">
            Confirm Password
          </Typography>
          <CustomTextField
            id="confirmPassword"
            variant="outlined"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          {/* Show validation errors */}
          {formError.length > 0 && (
            <Box sx={{ color: 'error.main', mt: 2 }}>
              {formError.map((err, index) => (
                <Typography key={index} variant="body2">
                  {err}
                </Typography>
              ))}
            </Box>
          )}
        </Stack>

        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          Sign Up
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
