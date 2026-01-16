"use client";

import React from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import ProfessorGuard from "@/components/ProfessorGuard";
import ProfessorDashboard from "@/app/(DashboardLayout)/components/dashboard/ProfessorDashboard";

const ProfessorPage = () => {
  return (
    <ProfessorGuard>
      <PageContainer title="Dashboard" description="Professor Dashboard">
        <ProfessorDashboard />
      </PageContainer>
    </ProfessorGuard>
  );
};

export default ProfessorPage;

