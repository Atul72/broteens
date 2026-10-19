import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "@broteens/features";
import { AuthShell } from "@/components/AuthShell";
import { Spinner } from "@/components/Spinner";

export const metadata: Metadata = {
  title: "Create Account - Reachdesk",
  description:
    "Create your Reachdesk account to send email and WhatsApp campaigns with ease.",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <Spinner
          fullScreen
          size="lg"
          label="Loading registration..."
          sublabel="Connecting to your Reachdesk workspace"
        />
      }
    >
      <AuthShell
        title="Create your account"
        description="Start sending high-converting campaigns in minutes."
        headline={"Scale your reach.\nTurn clicks to conversions."}
        subheadline="Join thousands of businesses sending verified email and WhatsApp campaigns with Reachdesk."
        featureTitle="Everything you need to grow"
        featurePoints={[
          "Set up and launch in under 2 minutes",
          "Meta-approved WhatsApp marketing templates",
          "Unified inbox with real-time delivery reports",
          "Automated opt-out and compliance handling",
        ]}
      >
        <SignupForm
          apiBaseUrl={authApiUrl}
          googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          redirectTo="/profile"
          loginHref="/login"
        />
      </AuthShell>
    </Suspense>
  );
}
