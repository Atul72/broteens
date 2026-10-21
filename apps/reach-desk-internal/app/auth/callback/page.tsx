"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthSession, type AuthSession } from "@broteens/features";
import { Spinner } from "@/components/Spinner";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const { setSession } = useAuthSession();

  useEffect(() => {
    const rawSession = searchParams.get("session");
    const redirectPath = searchParams.get("redirect") || "/templates";

    if (rawSession) {
      try {
        const decoded = decodeURIComponent(rawSession);
        const parsed = JSON.parse(decoded) as AuthSession;
        if (parsed?.accessToken) {
          setSession(parsed);
          window.location.replace(redirectPath);
          return;
        }
      } catch (err) {
        console.error(
          "[reach-desk-internal] Failed to parse session payload",
          err,
        );
      }
    }

    // Fallback navigation
    window.location.replace(redirectPath);
  }, [searchParams, setSession]);

  return (
    <Spinner
      fullScreen
      size="lg"
      label="Connecting workspace..."
      sublabel="Preparing your templates dashboard"
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Spinner
          fullScreen
          size="lg"
          label="Authenticating..."
          sublabel="Connecting to your workspace session"
        />
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
