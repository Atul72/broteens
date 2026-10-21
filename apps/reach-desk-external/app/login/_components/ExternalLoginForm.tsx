"use client";

import { LoginForm, type AuthSession } from "@broteens/features";

interface ExternalLoginFormProps {
  apiBaseUrl: string;
  googleClientId?: string;
  signupHref: string;
}

export function ExternalLoginForm({
  apiBaseUrl,
  googleClientId,
  signupHref,
}: ExternalLoginFormProps) {
  const internalAppUrl =
    process.env.NEXT_PUBLIC_INTERNAL_APP_URL ?? "http://localhost:3001";

  const handleSuccess = (session: AuthSession) => {
    try {
      const sessionData = encodeURIComponent(JSON.stringify(session));
      window.location.assign(
        `${internalAppUrl}/auth/callback?session=${sessionData}&redirect=/templates`,
      );
    } catch {
      window.location.assign(`${internalAppUrl}/templates`);
    }
  };

  return (
    <LoginForm
      apiBaseUrl={apiBaseUrl}
      googleClientId={googleClientId}
      onSuccess={handleSuccess}
      redirectTo={`${internalAppUrl}/templates`}
      signupHref={signupHref}
    />
  );
}
