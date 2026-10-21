import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { Spinner } from "@/components/Spinner";
import { ExternalLoginForm } from "./_components/ExternalLoginForm";

export const metadata: Metadata = {
  title: "Sign in - Reachdesk",
  description:
    "Sign in to your Reachdesk workspace to manage email and WhatsApp campaigns.",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Spinner
          fullScreen
          size="lg"
          label="Loading sign in..."
          sublabel="Connecting to your Reachdesk workspace"
        />
      }
    >
      <AuthShell
        title="Welcome back"
        description="Sign in to manage your workspace."
        headline={"One workspace.\nEvery campaign."}
        subheadline="Email and WhatsApp campaigns, thoughtfully managed from one simple platform."
        featureTitle="Campaigns that stay in control"
        featurePoints={[
          "Separate channel permissions",
          "Contact imports with clear validation",
          "Delivery insights and opt-out tracking",
        ]}
      >
        <ExternalLoginForm
          apiBaseUrl={authApiUrl}
          googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          signupHref="/signup"
        />
      </AuthShell>
    </Suspense>
  );
}
