"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterRedirectPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  useEffect(() => {
    if (roleParam && typeof window !== "undefined") {
      const upper = roleParam.toUpperCase();
      // Keep existing role mapping behavior via sessionStorage
      const normalizedRole =
        upper === "MENTORS" ? "MENTOR" : upper;
      sessionStorage.setItem("pendingRole", normalizedRole);
    }

    const returnTo = window.location.href;
    window.location.assign(
      `https://auth.ilc.limited/signup?returnTo=${encodeURIComponent(returnTo)}`
    );
  }, [roleParam]);

  return null;
}
