import { Spinner } from "@/components/Spinner";

export default function SignupLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading registration..."
      sublabel="Connecting to your Reachdesk workspace"
    />
  );
}
