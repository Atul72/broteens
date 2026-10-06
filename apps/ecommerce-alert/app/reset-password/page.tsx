import type { Metadata } from "next";

import { AuthShell, ResetPasswordForm } from "@broteens/features";
import { Alert } from "@repo/ui";

export const metadata: Metadata = {
  title: "Reset password",
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
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Use a strong password that you have not used for this account before."
    >
      {token ? (
        <ResetPasswordForm apiBaseUrl={authApiUrl} token={token} />
      ) : (
        <div className="space-y-5">
          <Alert variant="error">
            This password reset link is missing its token. Request a new link
            and try again.
          </Alert>
          <a
            href="/login"
            className="inline-flex text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
          >
            Return to sign in
          </a>
        </div>
      )}
    </AuthShell>
  );
}
