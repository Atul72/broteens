import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading Reachdesk..."
      sublabel="Setting up your campaign workspace"
    />
  );
}
