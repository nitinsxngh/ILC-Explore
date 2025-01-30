import React, { useState } from "react";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Checkbox } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";

interface LoginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin: React.FC<LoginType> = ({ title, subtitle, subtext }: LoginType) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const router = useRouter(); // For navigation after successful login

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true before making the API call

    try {
      const response = await axios.post("https://api.ilc.limited/api/users/login", {
        email,
        password,
      });

      // Handle success
      console.log("Login successful:", response.data);

      // Store user data in localStorage and redirect to home page
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/"); // Redirect after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong."); // Display error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
              Email Address
            </Typography>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Box>

          <Box mt="25px">
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
              Password
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </Box>

          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Remember this Device" />
            </FormGroup>
            <Typography
              component={Link}
              href="/authentication/forgot-password" // Link to a forgot password page
              fontWeight="500"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Stack>

        {/* Display error message */}
        {error && (
          <Box sx={{ color: "error.main", mt: 2 }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        {subtitle}
      </form>
    </>
  );
};

export default AuthLogin;
