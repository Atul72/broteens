"use client";

import { useCallback } from "react";

import { useAsyncAction } from "@broteens/hooks";
import { Alert } from "@repo/ui";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { authenticateWithGoogle } from "./api";
import type { AuthSession } from "./types";
import { useAuthSession } from "./use-auth-session";

export interface GoogleAuthButtonProps {
  apiBaseUrl: string;
  clientId?: string | undefined;
  onSuccess?: ((session: AuthSession) => void) | undefined;
  redirectTo?: string | undefined;
}

function GoogleButton({
  apiBaseUrl,
  onSuccess,
  redirectTo,
}: Omit<GoogleAuthButtonProps, "clientId">) {
  const { setSession } = useAuthSession();
  const authenticate = useCallback(
    (credential: string) => authenticateWithGoogle(apiBaseUrl, credential),
    [apiBaseUrl],
  );
  const { error, execute, isPending } = useAsyncAction(authenticate);

  async function handleCredential(credential?: string) {
    if (!credential || isPending) return;
    try {
      const session = await execute(credential);
      setSession(session);
      if (onSuccess) onSuccess(session);
      else if (redirectTo) window.location.assign(redirectTo);
    } catch {
      // The hook exposes the normalized error below.
    }
  }

  return (
    <div className="space-y-3">
      <div className={isPending ? "pointer-events-none opacity-60" : ""}>
        <GoogleLogin
          onSuccess={(response) => void handleCredential(response.credential)}
          onError={() => void handleCredential()}
          shape="pill"
          size="large"
          text="continue_with"
          theme="outline"
        />
      </div>
      {error ? <Alert variant="error">{error.message}</Alert> : null}
    </div>
  );
}

export function GoogleAuthButton(props: GoogleAuthButtonProps) {
  if (!props.clientId) return null;
  return (
    <GoogleOAuthProvider clientId={props.clientId}>
      <GoogleButton
        apiBaseUrl={props.apiBaseUrl}
        onSuccess={props.onSuccess}
        redirectTo={props.redirectTo}
      />
    </GoogleOAuthProvider>
  );
}
