import type { Metadata } from "next";

import { AuthShell, LoginForm } from "@broteens/features";

export const metadata: Metadata = {
  title: "Sign in",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your product watches and price-drop alerts."
    >
      <LoginForm
        apiBaseUrl={authApiUrl}
        googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        redirectTo="/settings"
      />
    </AuthShell>
  );
}
