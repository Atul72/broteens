import { Spinner } from "@/components/Spinner";

export default function SettingsLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading workspace settings..."
      sublabel="Preparing your profile and preferences"
    />
  );
}
