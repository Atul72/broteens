import type { AuthSession, TokenPair } from "./types";

export const AUTH_STORAGE_KEY = "broteens.auth.session";

let inFlightRefresh: Promise<AuthSession | null> | null = null;

/**
 * Direct call to backend /refresh endpoint
 */
export async function refreshTokens(
  baseUrl: string,
  refreshToken: string,
): Promise<TokenPair> {
  const url = `${baseUrl.replace(/\/$/, "")}/refresh`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "Failed to refresh token";
    throw new Error(message);
  }

  return payload as TokenPair;
}

/**
 * Deduplicated, race-condition-safe silent session refresh.
 * Reuses active in-flight refresh promise to prevent refresh token rotation collisions.
 */
export async function performTokenRefresh(
  baseUrl: string,
  currentSession: AuthSession,
): Promise<AuthSession | null> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    try {
      if (!currentSession?.refreshToken) {
        return null;
      }

      // Check if refresh token itself is expired (e.g. past 30 days)
      if (currentSession.refreshTokenExpiresAt) {
        const refreshExpiry = new Date(
          currentSession.refreshTokenExpiresAt,
        ).getTime();
        if (!isNaN(refreshExpiry) && refreshExpiry <= Date.now()) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
          }
          return null;
        }
      }

      const pair = await refreshTokens(baseUrl, currentSession.refreshToken);

      const refreshedSession: AuthSession = {
        ...currentSession,
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
        tokenType: pair.tokenType,
        accessTokenExpiresAt: pair.accessTokenExpiresAt,
        refreshTokenExpiresAt: pair.refreshTokenExpiresAt,
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(refreshedSession),
        );
        window.dispatchEvent(
          new CustomEvent("broteens:auth-refreshed", {
            detail: refreshedSession,
          }),
        );
      }

      return refreshedSession;
    } catch {
      return null;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}
