"use client";

import { useLocalStorage } from "@broteens/hooks";

import type { AuthSession } from "./types";

const AUTH_STORAGE_KEY = "broteens.auth.session";

export function useAuthSession() {
  const [session, setSession, clearSession] =
    useLocalStorage<AuthSession | null>(AUTH_STORAGE_KEY, null);

  return { clearSession, session, setSession };
}
