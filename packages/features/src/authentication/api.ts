import { getApiErrorMessage } from "@broteens/errors";

import type { AuthSession, AuthUser, LoginValues, SignupValues } from "./types";

function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function request<TResult>(
  baseUrl: string,
  path: string,
  body: unknown,
  options: { accessToken?: string; method?: "PATCH" | "POST" } = {},
): Promise<TResult> {
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
