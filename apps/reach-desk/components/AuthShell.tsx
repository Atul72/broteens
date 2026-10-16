"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ReachdeskLogo } from "./ReachdeskLogo";
import { Spinner } from "./Spinner";

export interface AuthShellProps {
  children: ReactNode;
  title: string;
  description: string;
  headline?: string;
  subheadline?: string;
  featureTitle?: string;
  featurePoints?: string[];
  guestOnly?: boolean;
  fallback?: ReactNode;
  authApiUrl?: string;
}

export function AuthShell({
  children,
  title,
  description,
  headline = "One workspace.\nEvery campaign.",
  subheadline = "Email and WhatsApp campaigns, thoughtfully managed from one simple platform.",
  featureTitle = "Campaigns that stay in control",
  featurePoints = [
    "Separate channel permissions",
    "Contact imports with clear validation",
    "Delivery insights and opt-out tracking",
  ],
  guestOnly = true,
  fallback,
  authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL ??
    "http://localhost:4000/v1/auth",
}: AuthShellProps) {
  // Start in "checking" state when guestOnly is active so that neither SSR
  // nor initial client paint renders the login/signup form before session verification.
  const [authStatus, setAuthStatus] = useState<
    "checking" | "authenticated" | "guest"
  >(guestOnly ? "checking" : "guest");
  const [redirectMessage, setRedirectMessage] = useState<string>(
    "Checking session...",
  );

  useEffect(() => {
    if (!guestOnly) {
      setAuthStatus("guest");
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("broteens.auth.session")
            : null;

        if (!raw) {
          if (isMounted) setAuthStatus("guest");
          return;
        }

        let parsed: {
          accessToken?: string;
          accessTokenExpiresAt?: string;
        } | null = null;

        try {
          parsed = JSON.parse(raw);
        } catch {
          localStorage.removeItem("broteens.auth.session");
          if (isMounted) setAuthStatus("guest");
          return;
        }

        const token = parsed?.accessToken;
        if (!token) {
          localStorage.removeItem("broteens.auth.session");
          if (isMounted) setAuthStatus("guest");
          return;
        }

        // Verify expiration timestamp if provided in the session payload
        if (parsed?.accessTokenExpiresAt) {
          const expiresAt = new Date(parsed.accessTokenExpiresAt).getTime();
          if (!isNaN(expiresAt) && expiresAt <= Date.now()) {
            localStorage.removeItem("broteens.auth.session");
            if (isMounted) setAuthStatus("guest");
            return;
          }
        }

        // Session exists and is locally valid - show redirect feedback
        if (isMounted) {
          setAuthStatus("authenticated");
          setRedirectMessage("Redirecting to your workspace...");
        }

        // Optional backend token verification with /v1/auth/me
        try {
          const res = await fetch(`${authApiUrl.replace(/\/$/, "")}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!isMounted) return;

          if (res.status === 401 || res.status === 403) {
            // Token was revoked or expired on backend
            localStorage.removeItem("broteens.auth.session");
            setAuthStatus("guest");
            return;
          }
        } catch {
          // If the backend is offline or network is degraded, proceed with local valid session
        }

        if (isMounted) {
          window.location.replace("/settings");
        }
      } catch {
        if (isMounted) setAuthStatus("guest");
      }
    }

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [guestOnly, authApiUrl]);

  // While checking session or redirecting on a guest-only route, show the Spinner fallback
  if (
    guestOnly &&
    (authStatus === "checking" || authStatus === "authenticated")
  ) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Spinner
        fullScreen
        size="lg"
        label={redirectMessage}
        sublabel={
          authStatus === "authenticated"
            ? "Taking you straight to your account settings"
            : "Verifying your workspace access"
        }
      />
    );
  }

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#FAF7FD] lg:bg-white selection:bg-lavender-200 selection:text-lavender-900">
      {/* Left Column: Brand & Feature Showcase in Deep Lavender Theme (Desktop only) */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-b from-[#2B0E4E] via-[#200A3A] to-[#150527] text-white p-8 sm:p-12 lg:p-16 flex-col justify-between relative overflow-hidden min-h-full">
        {/* Ambient lavender/purple glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-lavender-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <ReachdeskLogo
              textColor="text-white"
              iconClassName="w-8 h-8 text-lavender-400 group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Middle: Headline, Subheadline & Feature Box */}
        <div className="relative z-10 my-12 lg:my-0 space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] whitespace-pre-line">
              {headline}
            </h1>
            <p className="text-sm sm:text-base text-lavender-100/90 font-normal leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Feature Highlight Box with Lavender Styling */}
          <div className="rounded-2xl bg-white/[0.07] border border-lavender-300/20 p-6 sm:p-7 backdrop-blur-md shadow-2xl shadow-black/30">
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 tracking-tight">
              {featureTitle}
            </h3>
            <ul className="space-y-3">
              {featurePoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-xs sm:text-sm text-lavender-100"
                >
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-lavender-500/30 border border-lavender-400/30 text-lavender-200 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright & Legal */}
        <div className="relative z-10 pt-6 text-xs text-lavender-300/70 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© 2026 Reachdesk</span>
          <span>·</span>
          <Link href="/#privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/#terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </div>
      </section>

      {/* Right Column: Authentication Form Container */}
      <section className="col-span-1 lg:col-span-7 xl:col-span-7 bg-[#FAF7FD] flex flex-col items-center justify-center p-4 sm:p-8 lg:p-16 min-h-screen">
        <div className="w-full max-w-md">
          {/* Brand Logo on smaller screens when side banner is hidden */}
          <div className="mb-6 lg:hidden flex justify-center">
            <Link href="/" className="inline-flex items-center group">
              <ReachdeskLogo iconClassName="w-8 h-8 text-lavender-600 group-hover:scale-105 transition-transform" />
            </Link>
          </div>

          {/* Card Wrapper */}
          <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-xl shadow-lavender-900/5 border border-lavender-100/80">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">{description}</p>
            </div>

            {/* Injected Form from @broteens/features */}
            <div className="reachdesk-auth-form">{children}</div>
          </div>

          {/* Legal Subtext below the card */}
          <p className="mt-6 text-center text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/#terms" className="underline hover:text-lavender-600">
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/#privacy"
              className="underline hover:text-lavender-600"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
