"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@broteens/hooks";

import { AUTH_STORAGE_KEY, performTokenRefresh } from "./token-refresh";
import type { AuthSession } from "./types";

declare const process: { env?: Record<string, string | undefined> } | undefined;

function defaultApiUrl(): string {
  if (
    typeof process !== "undefined" &&
    process?.env?.NEXT_PUBLIC_AUTH_API_URL
  ) {
    return process.env.NEXT_PUBLIC_AUTH_API_URL;
  }
  return "http://localhost:4000/v1/auth";
}

export interface UseAuthSessionOptions {
  apiBaseUrl?: string;
  autoRefresh?: boolean;
}

export function useAuthSession(options: UseAuthSessionOptions = {}) {
  const { apiBaseUrl = defaultApiUrl(), autoRefresh = true } = options;

  const [session, setSession, clearSession] =
    useLocalStorage<AuthSession | null>(AUTH_STORAGE_KEY, null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual refresh helper
  const refreshSessionNow = useCallback(async () => {
    if (!session) return null;
    setIsRefreshing(true);
    try {
      const refreshed = await performTokenRefresh(apiBaseUrl, session);
      if (refreshed) {
        setSession(refreshed);
      } else {
        clearSession();
      }
      return refreshed;
    } finally {
      setIsRefreshing(false);
    }
  }, [apiBaseUrl, session, setSession, clearSession]);

  // Synchronize across components when a refresh completes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<AuthSession>;
      if (customEvent.detail) {
        setSession(customEvent.detail);
      }
    };

    window.addEventListener("broteens:auth-refreshed", handleRefreshed);
    return () => {
      window.removeEventListener("broteens:auth-refreshed", handleRefreshed);
    };
  }, [setSession]);

  // Proactive background timer: silently refresh ~60s before accessToken expires
  useEffect(() => {
    if (
      !autoRefresh ||
      !session?.accessTokenExpiresAt ||
      !session?.refreshToken
    ) {
      return;
    }

    const expiresAt = new Date(session.accessTokenExpiresAt).getTime();
    if (isNaN(expiresAt)) return;

    const now = Date.now();
    // Schedule refresh 60 seconds before expiration (or immediately if already within 60s)
    const refreshTarget = expiresAt - 60_000;
    const delay = Math.max(0, refreshTarget - now);

    const timer = setTimeout(async () => {
      setIsRefreshing(true);
      try {
        const refreshed = await performTokenRefresh(apiBaseUrl, session);
        if (refreshed) {
          setSession(refreshed);
        } else {
          clearSession();
        }
      } finally {
        setIsRefreshing(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [session, autoRefresh, apiBaseUrl, setSession, clearSession]);

  // Tab visibility / system wake listener
  useEffect(() => {
    if (
      !autoRefresh ||
      !session?.accessTokenExpiresAt ||
      !session?.refreshToken
    ) {
      return;
    }

    const handleVisibility = async () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        const expiresAt = new Date(session.accessTokenExpiresAt).getTime();
        // If expired or expiring within 60s
        if (!isNaN(expiresAt) && expiresAt - Date.now() <= 60_000) {
          setIsRefreshing(true);
          try {
            const refreshed = await performTokenRefresh(apiBaseUrl, session);
            if (refreshed) {
              setSession(refreshed);
            } else {
              clearSession();
            }
          } finally {
            setIsRefreshing(false);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session, autoRefresh, apiBaseUrl, setSession, clearSession]);

  return { clearSession, isRefreshing, refreshSessionNow, session, setSession };
}
