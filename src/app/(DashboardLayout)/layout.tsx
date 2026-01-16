"use client";

import React, { useState, useEffect, Suspense } from "react";
import { styled, Container, Box, CircularProgress } from "@mui/material";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import RoleSelectionHandler from "@/components/RoleSelectionHandler";
import { useAuth } from "@/contexts/AuthContext";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // You can tie this to actual data or router events

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar - Only show when user is authenticated */}
      {user && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Page Content */}
      <PageWrapper className="page-wrapper">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <AuthGuard>
            <Suspense fallback={null}>
              <RoleSelectionHandler />
            </Suspense>
            <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
            <Box
              sx={{
                paddingTop: "20px",
                paddingX: "20px",
                width: "100%",
              }}
            >
              <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
            </Box>
          </AuthGuard>
        )}
      </PageWrapper>
    </MainWrapper>
  );
}
