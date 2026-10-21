import React, { type ReactNode } from "react";

const sizeClasses = {
  xs: "w-3.5 h-3.5",
  sm: "w-[18px] h-[18px]",
  md: "w-[26px] h-[26px]",
  lg: "w-9 h-9",
  xl: "w-12 h-12",
} as const;

const colorSchemes = {
  lavender: {
    track: "text-lavender-200",
    indicator: "text-lavender-600",
  },
  white: {
    track: "text-white/20",
    indicator: "text-white",
  },
  slate: {
    track: "text-slate-200",
    indicator: "text-slate-700",
  },
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  color?: keyof typeof colorSchemes;
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
  const scheme = colorSchemes[color] ?? colorSchemes.lavender;
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;

  const spinnerSvg = (
    <svg
      className={`animate-spin ${sizeClass} ${scheme.indicator} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={
        ariaLabel ?? (typeof label === "string" ? label : "Loading...")
      }
    >
      <circle
        className={scheme.track}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <main className="min-h-screen w-full grid place-items-center bg-[#FAF7FD] p-6 selection:bg-lavender-200 selection:text-lavender-900">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm mx-auto">
          {/* Subtle Ambient Glow */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-lavender-400/25 blur-xl animate-pulse pointer-events-none" />
            <div className="relative z-10">{spinnerSvg}</div>
          </div>

          {/* Optional Label / Description */}
          {label && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800 tracking-tight">
                {label}
              </p>
              {sublabel && (
                <p className="text-xs text-slate-500 font-normal">{sublabel}</p>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (label || sublabel) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        {spinnerSvg}
        <div className="space-y-0.5">
          {label && (
            <p className="text-sm font-medium text-slate-700">{label}</p>
          )}
          {sublabel && (
            <p className="text-xs text-slate-500 font-normal">{sublabel}</p>
          )}
        </div>
      </div>
    );
  }

  return spinnerSvg;
}
