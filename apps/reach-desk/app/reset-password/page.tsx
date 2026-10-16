import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@broteens/features";
import { Alert } from "@repo/ui";
import { AuthShell } from "@/components/AuthShell";
import { Spinner } from "@/components/Spinner";

export const metadata: Metadata = {
  title: "Reset password - Reachdesk",
  robots: { index: false, follow: false },
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

interface ResetPasswordPageProps {
  searchParams: {
    token?: string | string[];
  };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  return (
    <Suspense
      fallback={
        <Spinner
          fullScreen
          size="lg"
          label="Loading password recovery..."
          sublabel="Connecting to your Reachdesk workspace"
        />
      }
    >
      <AuthShell
        title="Choose a new password"
        description="Use a strong password that you have not used for this account before."
        headline={"Account recovery.\nSecure & seamless."}
        subheadline="Regain access to your Reachdesk workspace safely."
        featureTitle="Account security features"
        featurePoints={[
          "Encrypted credential protection",
          "Immediate session revocation on password change",
          "Multi-channel authentication support",
        ]}
      >
        {token ? (
          <ResetPasswordForm apiBaseUrl={authApiUrl} token={token} />
        ) : (
          <div className="space-y-5">
            <Alert variant="error">
              This password reset link is missing its token. Request a new link
              and try again.
            </Alert>
            <Link
              href="/login"
              className="block text-center text-sm font-semibold text-lavender-600 hover:text-lavender-800"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </AuthShell>
    </Suspense>
  );
}
