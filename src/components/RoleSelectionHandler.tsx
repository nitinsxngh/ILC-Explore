"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import RoleSelectionModal from "./RoleSelectionModal";
import StudentProfileForm, { StudentFormData } from "./StudentProfileForm";
import StartupProfileForm, { StartupFormData } from "./StartupProfileForm";
import MentorProfileForm, { MentorFormData } from "./MentorProfileForm";
import ProfessorProfileForm, { ProfessorFormData } from "./ProfessorProfileForm";

type UserRole = "student" | "startup" | "mentor" | "professor";

const RoleSelectionHandler: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, hasRole, updateProfile } = useUserProfile();
  const searchParams = useSearchParams();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showProfessorForm, setShowProfessorForm] = useState(false);

  // Check URL parameter for role and store in sessionStorage
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && typeof window !== "undefined") {
      // Normalize role: remove trailing 'S' if present (MENTORS -> MENTOR)
      const normalizedRole = roleParam.toUpperCase().replace(/S$/, "");
      sessionStorage.setItem("pendingRole", normalizedRole);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user && !hasRole) {
      // Check if there's a pending role from URL
      const pendingRole = typeof window !== "undefined" ? sessionStorage.getItem("pendingRole") : null;
      if (pendingRole) {
        // Auto-select role if provided - handle both MENTOR and MENTORS
        const normalizedRole = pendingRole.toUpperCase().replace(/S$/, ""); // Remove trailing 'S' if present
        const roleMap: { [key: string]: UserRole } = {
          STUDENT: "student",
          STARTUP: "startup",
          MENTOR: "mentor",
          PROFESSOR: "professor",
        };
        const mappedRole = roleMap[normalizedRole];
        if (mappedRole) {
          // Remove from sessionStorage before handling
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pendingRole");
          }
          handleRoleSelection(mappedRole);
          return;
        }
      }
      // User is logged in but hasn't selected a role yet
      setShowRoleModal(true);
    } else if (!loading && user && hasRole && profile) {
      // Check if profile is incomplete based on role
      const role = profile.role;
      
      if (role === "student" && !profile.studentDetails?.completed) {
        setShowStudentForm(true);
      } else if (role === "startup" && !profile.startupDetails?.completed) {
        setShowStartupForm(true);
      } else if (role === "mentor" && !profile.mentorDetails?.completed) {
        setShowMentorForm(true);
      } else if (role === "professor" && !profile.professorDetails?.completed) {
        setShowProfessorForm(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, hasRole, profile]);

  const handleRoleSelection = async (role: UserRole) => {
    try {
      if (!user) return;

      await updateProfile({ role });
      setShowRoleModal(false);

      // Show appropriate form based on role
      if (role === "student") {
        setShowStudentForm(true);
      } else if (role === "startup") {
        setShowStartupForm(true);
      } else if (role === "mentor") {
        setShowMentorForm(true);
      } else if (role === "professor") {
        setShowProfessorForm(true);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleStudentFormSubmit = async (data: StudentFormData) => {
    try {
      if (!user) return;

      await updateProfile({
        role: "student",
        studentDetails: {
          ...data,
          completed: true,
        },
      });
      setShowStudentForm(false);
    } catch (error) {
      console.error("Error submitting student form:", error);
      throw error;
    }
  };

  const handleStartupFormSubmit = async (data: StartupFormData) => {
    try {
      if (!user) return;

      await updateProfile({
        role: "startup",
        startupDetails: {
          ...data,
          completed: true,
        },
      });
      setShowStartupForm(false);
    } catch (error) {
      console.error("Error submitting startup form:", error);
      throw error;
    }
  };

  const handleMentorFormSubmit = async (data: MentorFormData) => {
    try {
      if (!user) return;

      await updateProfile({
        role: "mentor",
        mentorDetails: {
          ...data,
          completed: true,
        },
      });
      setShowMentorForm(false);
    } catch (error) {
      console.error("Error submitting mentor form:", error);
      throw error;
    }
  };

  const handleProfessorFormSubmit = async (data: ProfessorFormData) => {
    try {
      if (!user) return;

      await updateProfile({
        role: "professor",
        professorDetails: {
          ...data,
          completed: true,
        },
      });
      setShowProfessorForm(false);
    } catch (error) {
      console.error("Error submitting professor form:", error);
      throw error;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <RoleSelectionModal
        open={showRoleModal}
        onSelectRole={handleRoleSelection}
        userName={user.displayName || user.email?.split("@")[0] || "User"}
      />
      <StudentProfileForm
        open={showStudentForm}
        onSubmit={handleStudentFormSubmit}
        userEmail={user.email || undefined}
      />
      <StartupProfileForm
        open={showStartupForm}
        onSubmit={handleStartupFormSubmit}
        userEmail={user.email || undefined}
      />
      <MentorProfileForm
        open={showMentorForm}
        onSubmit={handleMentorFormSubmit}
        userEmail={user.email || undefined}
      />
      <ProfessorProfileForm
        open={showProfessorForm}
        onSubmit={handleProfessorFormSubmit}
        userEmail={user.email || undefined}
      />
    </>
  );
};

export default RoleSelectionHandler;
