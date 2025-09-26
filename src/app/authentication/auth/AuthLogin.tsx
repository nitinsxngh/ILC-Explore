import React, { useState } from "react";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Checkbox, Divider } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { IconBrandGoogle } from "@tabler/icons-react";

interface LoginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin: React.FC<LoginType> = ({ title, subtitle, subtext }: LoginType) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.push("/"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
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
      </form>
    </>
  );
};

export default AuthLogin;
