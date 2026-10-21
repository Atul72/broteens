import { Spinner } from "@/components/Spinner";

export default function LoginLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading sign in..."
      sublabel="Connecting to your Reachdesk workspace"
    />
  );
}
