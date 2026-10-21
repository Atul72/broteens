import { Spinner } from "@/components/Spinner";

export default function TemplatesLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      label="Loading templates..."
      sublabel="Preparing your workspace templates and channels"
    />
  );
}
