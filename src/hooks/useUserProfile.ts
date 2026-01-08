"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  userId: string;
  role?: "student" | "mentor";
  mentorDetails?: {
    fullName: string;
    title: string;
    experience: string;
    company: string;
    specialization: string;
    bio: string;
    email: string;
    phone?: string;
    linkedin?: string;
    completed: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user-profile?userId=${user.uid}`);
        const data = await response.json();

        if (response.ok) {
          setProfile(data.profile);
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          ...profileData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
        return data.profile;
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to update profile");
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    isMentor: profile?.role === "mentor",
    isStudent: profile?.role === "student" || !profile?.role,
    hasRole: !!profile?.role,
    mentorDetailsComplete: profile?.mentorDetails?.completed || false,
  };
};

