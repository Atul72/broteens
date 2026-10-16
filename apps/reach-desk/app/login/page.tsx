import type { Metadata } from "next";
import { LoginForm } from "@broteens/features";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Sign in - Reachdesk",
  description:
    "Sign in to your Reachdesk workspace to manage email and WhatsApp campaigns.",
};

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function LoginPage() {
  return (
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
      <LoginForm
        apiBaseUrl={authApiUrl}
        googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        redirectTo="/settings"
        signupHref="/signup"
      />
    </AuthShell>
  );
}
