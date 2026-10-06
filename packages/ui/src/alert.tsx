import type { ReactNode } from "react";

const styles = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
} as const;

export function Alert({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: keyof typeof styles;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-xl border px-3.5 py-3 text-sm ${styles[variant]}`}
    >
      {children}
    </div>
  );
}
