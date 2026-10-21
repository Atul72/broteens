import React from "react";

interface ReachdeskLogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textColor?: string;
}

export function ReachdeskLogo({
  className = "",
  iconClassName = "w-7 h-7 text-lavender-600",
  showText = true,
  textColor = "text-slate-900",
}: ReachdeskLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}
    >
      <div
        className={`relative shrink-0 flex items-center justify-center ${iconClassName}`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Main top wing */}
          <path
            d="M3.5 15.5L28.5 4.5L17.5 19L3.5 15.5Z"
            fill="currentColor"
            fillOpacity="0.82"
          />
          {/* Main bottom wing */}
          <path
            d="M17.5 19L28.5 4.5L14.5 28L12.5 20.5L17.5 19Z"
            fill="currentColor"
          />
          {/* Center crease fold */}
          <path
            d="M12.5 20.5L17.5 19L14.5 28L12.5 20.5Z"
            fill="currentColor"
            fillOpacity="0.65"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={`text-xl sm:text-2xl font-bold tracking-tight ${textColor}`}
        >
          Reachdesk
        </span>
      )}
    </div>
  );
}
