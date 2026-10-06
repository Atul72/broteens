import type { Metadata } from "next";

import { SettingsScreen } from "@broteens/features";

export const metadata: Metadata = {
  title: "Settings",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function SettingsPage() {
  return <SettingsScreen apiBaseUrl={authApiUrl} />;
}
