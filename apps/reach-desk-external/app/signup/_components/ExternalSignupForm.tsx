"use client";

import { SignupForm, type AuthSession } from "@broteens/features";

interface ExternalSignupFormProps {
  apiBaseUrl: string;
  googleClientId?: string;
  loginHref: string;
}

export function ExternalSignupForm({
  apiBaseUrl,
  googleClientId,
  loginHref,
}: ExternalSignupFormProps) {
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
    <SignupForm
      apiBaseUrl={apiBaseUrl}
      googleClientId={googleClientId}
      onSuccess={handleSuccess}
      redirectTo={`${internalAppUrl}/templates`}
      loginHref={loginHref}
    />
  );
}
