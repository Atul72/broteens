import { getApiErrorMessage } from "@broteens/errors";

import {
  AUTH_STORAGE_KEY,
  performTokenRefresh,
  refreshTokens,
} from "./token-refresh";
import type {
  AuthSession,
  AuthUser,
  LoginValues,
  SignupValues,
  TokenPair,
} from "./types";

function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function request<TResult>(
  baseUrl: string,
  path: string,
  body: unknown,
  options: {
    accessToken?: string;
    method?: "PATCH" | "POST";
    retryOn401?: boolean;
  } = {},
): Promise<TResult> {
  const retryOn401 = options.retryOn401 ?? true;

  const response = await fetch(endpoint(baseUrl, path), {
    method: options.method ?? "POST",
    headers: {
      "content-type": "application/json",
      ...(options.accessToken
        ? { authorization: `Bearer ${options.accessToken}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  // Intercept 401: attempt silent refresh if we have a refreshToken in localStorage
  if (
    response.status === 401 &&
    retryOn401 &&
    options.accessToken &&
    path !== "/signin" &&
    path !== "/signup" &&
    path !== "/refresh"
  ) {
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(AUTH_STORAGE_KEY)
        : null;

    if (raw) {
      try {
        const session = JSON.parse(raw) as AuthSession;
        if (session?.refreshToken) {
          const refreshed = await performTokenRefresh(baseUrl, session);
          if (refreshed?.accessToken) {
            // Retry the original request with the freshly acquired accessToken
            return request<TResult>(baseUrl, path, body, {
              ...options,
              accessToken: refreshed.accessToken,
              retryOn401: false,
            });
          }
        }
      } catch {
        // Fall through to error handling
      }
    }
  }

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(payload, "The request could not be completed"),
    );
  }
  return payload as TResult;
}

export function login(baseUrl: string, values: LoginValues) {
  return request<AuthSession>(baseUrl, "/signin", values);
}

export function signup(baseUrl: string, values: SignupValues) {
  return request<AuthSession>(baseUrl, "/signup", values);
}

export function authenticateWithGoogle(baseUrl: string, idToken: string) {
  return request<AuthSession>(baseUrl, "/google", { idToken });
}

export function refreshSession(
  baseUrl: string,
  refreshToken: string,
): Promise<TokenPair> {
  return refreshTokens(baseUrl, refreshToken);
}

export function forgotPassword(baseUrl: string, email: string) {
  return request<{ message: string }>(baseUrl, "/forgot-password", { email });
}

export function logout(baseUrl: string, refreshToken: string) {
  return request<void>(baseUrl, "/logout", { refreshToken });
}

export async function resetPassword(
  baseUrl: string,
  values: { token: string; password: string; confirmPassword: string },
) {
  await request<void>(baseUrl, "/reset-password", values);
  return { message: "Your password has been updated" };
}

export function updateProfile(
  baseUrl: string,
  accessToken: string,
  values: { fullName: string; avatarUrl: string | null },
) {
  return request<{ user: AuthUser }>(baseUrl, "/profile", values, {
    accessToken,
    method: "PATCH",
  });
}
