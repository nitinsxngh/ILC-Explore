"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";

const AuthLoginWrapper = () => {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  
  // Store role in sessionStorage if provided - normalize MENTORS to MENTOR
  useEffect(() => {
    if (roleParam && typeof window !== "undefined") {
      // Normalize role: remove trailing 'S' if present (MENTORS -> MENTOR)
      const normalizedRole = roleParam.toUpperCase().replace(/S$/, "");
      sessionStorage.setItem("pendingRole", normalizedRole);
    }
  }, [roleParam]);

  return (
    <AuthLogin
      subtext={
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="textSecondary"
          mb={1}
        >
          Integrated Learning Circle
        </Typography>
      }
      subtitle={
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          mt={3}
        >
          <Typography
            color="textSecondary"
            variant="h6"
            fontWeight="500"
          >
            New to ILC?
          </Typography>
          <Typography
            component={Link}
            href="/authentication/register"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Create an account
          </Typography>
        </Stack>
      }
    />
  );
};

const Login2Content = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthLoginWrapper />
              </Suspense>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

const Login2 = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login2Content />
    </Suspense>
  );
};

export default Login2;
