"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import RoleSelectionModal from "./RoleSelectionModal";
import MentorOnboardingForm, { MentorFormData } from "./MentorOnboardingForm";

const RoleSelectionHandler: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, hasRole, isMentor, mentorDetailsComplete, updateProfile } = useUserProfile();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);

  useEffect(() => {
    if (!loading && user && !hasRole) {
      // User is logged in but hasn't selected a role yet
      setShowRoleModal(true);
    } else if (!loading && user && isMentor && !mentorDetailsComplete) {
      // User is a mentor but hasn't completed their details
      setShowMentorForm(true);
    }
  }, [loading, user, hasRole, isMentor, mentorDetailsComplete]);

  const handleRoleSelection = async (role: "student" | "mentor") => {
    try {
      if (!user) return;

      await updateProfile({ role });
      setShowRoleModal(false);

      if (role === "mentor") {
        setShowMentorForm(true);
      }
    } catch (error) {
      console.error("Error updating role:", error);
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
      <MentorOnboardingForm
        open={showMentorForm}
        onSubmit={handleMentorFormSubmit}
      />
    </>
  );
};

export default RoleSelectionHandler;

