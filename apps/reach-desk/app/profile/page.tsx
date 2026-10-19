import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsScreen } from "@broteens/features";
import { Navbar } from "@/components/Navbar";
import { Spinner } from "@/components/Spinner";

export const metadata: Metadata = {
  title: "Settings - Reachdesk",
  description: "Manage your Reachdesk workspace account and profile settings.",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
      <Navbar />
      <div className="flex-1 w-full">
        <Suspense
          fallback={
            <Spinner
              fullScreen
              size="lg"
              label="Loading workspace settings..."
              sublabel="Preparing your profile and channel preferences"
            />
          }
        >
          <SettingsScreen apiBaseUrl={authApiUrl} />
        </Suspense>
      </div>
    </div>
  );
}
