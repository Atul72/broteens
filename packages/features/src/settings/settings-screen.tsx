"use client";

import { useCallback, useEffect, useState } from "react";

import { updateProfile } from "../authentication/api";
import { useAuthSession } from "../authentication/use-auth-session";
import {
  ProfileSettingsForm,
  type ProfileSettingsValues,
} from "./profile-settings-form";

export function SettingsScreen({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [isReady, setIsReady] = useState(false);
  const { clearSession, session, setSession } = useAuthSession();

  useEffect(() => setIsReady(true), []);
  useEffect(() => {
    if (isReady && !session) window.location.replace("/login");
  }, [isReady, session]);

  const saveProfile = useCallback(
    async (values: ProfileSettingsValues) => {
      if (!session)
        throw new Error("Your session has expired. Please sign in again.");
      const result = await updateProfile(apiBaseUrl, session.accessToken, {
        fullName: values.fullName,
        avatarUrl: values.avatarUrl.trim() || null,
      });
      setSession({ ...session, user: result.user });
    },
    [apiBaseUrl, session, setSession],
  );

  if (!isReady || !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-r-slate-950" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Profile Settings
            </h1>
          </div>
        </header>

        <ProfileSettingsForm
          initialValues={{
            avatarUrl: session.user.avatarUrl ?? "",
            email: session.user.email,
            fullName: session.user.fullName,
          }}
          onSave={saveProfile}
        />
      </div>
    </main>
  );
}
