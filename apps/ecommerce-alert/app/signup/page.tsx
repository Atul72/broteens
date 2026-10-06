import type { Metadata } from "next";

import { AuthShell, SignupForm } from "@broteens/features";

export const metadata: Metadata = {
  title: "Create account",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start tracking the products you care about in a couple of minutes."
    >
      <SignupForm
        apiBaseUrl={authApiUrl}
        googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      />
    </AuthShell>
  );
}
