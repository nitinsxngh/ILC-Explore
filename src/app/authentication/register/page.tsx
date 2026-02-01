"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import { Suspense, useEffect, useState } from "react";
import AuthRegister from "../auth/AuthRegister";
import { useSearchParams } from "next/navigation";

const Register2Content = () => {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  
  // Map URL role parameter to role value
  const getRoleFromParam = (param: string | null): "student" | "startup" | "mentor" | "professor" | null => {
    if (!param) return null;
    const upperParam = param.toUpperCase();
    if (upperParam === "STUDENT") return "student";
    if (upperParam === "STARTUP") return "startup";
    if (upperParam === "MENTOR" || upperParam === "MENTORS") return "mentor";
    if (upperParam === "PROFESSOR") return "professor";
    return null;
  };

  const role = getRoleFromParam(roleParam);

  return (
    <PageContainer title="Register" description="this is Register page">
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
          sx={{ 
            height: "100vh",
            overflow: "auto",
            py: { xs: 2, md: 4 }
          }}
        >
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={7}
            xl={6}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            sx={{ pt: { xs: 2, md: 4 } }}
          >
            <Card
              elevation={9}
              sx={{ 
                p: { xs: 3, sm: 4, md: 5 },
                zIndex: 1,
                width: "100%",
                maxWidth: { xs: "100%", sm: "800px", md: "900px", lg: "1000px" },
                maxHeight: { xs: "none", md: "95vh" },
                overflow: "auto"
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <AuthRegister
                role={role || "student"}
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
                    justifyContent="center"
                    spacing={1}
                    mt={3}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="400"
                    >
                      Already have an Account?
                    </Typography>
                    <Typography
                      component={Link}
                      href="/authentication/login"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Sign In
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

const Register2 = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register2Content />
    </Suspense>
  );
};

export default Register2;
