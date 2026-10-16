import type { ReactNode } from "react";

const sizeClasses = {
  xs: "w-3.5 h-3.5",
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
  xl: "w-14 h-14",
} as const;

const colorClasses = {
  lavender: "text-purple-600",
  primary: "text-purple-600",
  white: "text-white",
  slate: "text-slate-600",
  current: "text-current",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  color?: keyof typeof colorClasses;
  label?: ReactNode;
  sublabel?: ReactNode;
  fullScreen?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Spinner({
  size = "md",
  color = "lavender",
  label,
  sublabel,
  fullScreen = false,
  className = "",
  ariaLabel,
}: SpinnerProps) {
  const spinnerElement = (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={
        ariaLabel ?? (typeof label === "string" ? label : "Loading...")
      }
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <main className="min-h-screen w-full grid place-items-center bg-[#FAF7FD] p-4 selection:bg-purple-200 selection:text-purple-900">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-purple-400/20 blur-xl animate-pulse pointer-events-none" />
            <div className="relative z-10">{spinnerElement}</div>
          </div>
          {label && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800 tracking-tight">
                {label}
              </p>
              {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (label || sublabel) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        {spinnerElement}
        {label && (
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-slate-700">{label}</p>
            {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
          </div>
        )}
      </div>
    );
  }

  return spinnerElement;
}
