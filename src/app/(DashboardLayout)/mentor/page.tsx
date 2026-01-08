"use client";

import React from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import MentorGuard from "@/components/MentorGuard";
import MentorDashboard from "@/app/(DashboardLayout)/components/dashboard/MentorDashboard";

const MentorPage = () => {
  return (
    <MentorGuard>
      <PageContainer title="Dashboard" description="Mentor Dashboard">
        <MentorDashboard />
      </PageContainer>
    </MentorGuard>
  );
};

export default MentorPage;

