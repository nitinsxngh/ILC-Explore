"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginRedirectPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  useEffect(() => {
    if (roleParam && typeof window !== "undefined") {
      const normalizedRole = roleParam.toUpperCase().replace(/S$/, "");
      sessionStorage.setItem("pendingRole", normalizedRole);
    }

    const returnTo = window.location.href;
    window.location.assign(
      `https://auth.ilc.limited/login?returnTo=${encodeURIComponent(returnTo)}`
    );
  }, [roleParam]);

  return null;
}
