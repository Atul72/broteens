"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<string>("384");
  const { setSession } = useAuthSession();

  useEffect(() => {
    if (!containerRef.current) return;
    const calculateWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        if (clientWidth > 0) {
          // Google button width must be between 200 and 400 pixels
          const clamped = Math.min(400, Math.max(200, Math.floor(clientWidth)));
          setButtonWidth(String(clamped));
        }
      }
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

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
    <div className="w-full space-y-3">
      <div
        ref={containerRef}
        className={`flex w-full justify-center ${
          isPending ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={(response) => void handleCredential(response.credential)}
          onError={() => void handleCredential()}
          shape="pill"
          size="large"
          text="continue_with"
          theme="outline"
          width={buttonWidth}
          containerProps={{
            className: "flex justify-center w-full",
            style: { width: "100%", display: "flex", justifyContent: "center" },
          }}
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
