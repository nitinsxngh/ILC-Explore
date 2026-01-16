"use client";

import React from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import StartupGuard from "@/components/StartupGuard";
import StartupDashboard from "@/app/(DashboardLayout)/components/dashboard/StartupDashboard";

const StartupPage = () => {
  return (
    <StartupGuard>
      <PageContainer title="Dashboard" description="Startup Dashboard">
        <StartupDashboard />
      </PageContainer>
    </StartupGuard>
  );
};

export default StartupPage;

