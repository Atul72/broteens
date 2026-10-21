import { Spinner } from "@/components/Spinner";

export default function SettingsLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading profile..."
      sublabel="Preparing your profile and preferences"
    />
  );
}
