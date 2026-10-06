import { type SVGProps } from "react";

export type IconName =
  | "bell"
  | "clock"
  | "filter"
  | "headphones"
  | "mail"
  | "message"
  | "pause"
  | "speaker"
  | "trend"
  | "watch";

export default function Icon({
  name,
  className = "h-5 w-5",
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  let drawing;

  switch (name) {
    case "trend":
      drawing = (
        <>
          <path d="M4 16l5-5 4 3 7-9" />
          <path d="M16 5h4v4M4 20h16" />
        </>
      );
      break;
    case "bell":
      drawing = (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </>
      );
      break;
    case "mail":
      drawing = (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      );
      break;
    case "message":
      drawing = (
        <>
          <path d="M4 4h16v12H9l-5 4z" />
          <path d="M8 8h8M8 12h5" />
        </>
      );
      break;
    case "clock":
      drawing = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </>
      );
      break;
    case "filter":
      drawing = <path d="M4 5h16l-6 7v7l-4-2v-5z" />;
      break;
    case "pause":
      drawing = <path d="M8 5v14M16 5v14" />;
      break;
    case "headphones":
      drawing = (
        <>
          <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
          <rect x="3" y="12" width="5" height="9" rx="2" />
          <rect x="16" y="12" width="5" height="9" rx="2" />
        </>
      );
      break;
    case "watch":
      drawing = (
        <>
          <rect x="5" y="6" width="14" height="13" rx="4" />
          <path d="M8 6V2h8v4M8 19v3h8v-3M12 9v4l3 1" />
        </>
      );
      break;
    case "speaker":
      drawing = (
        <>
          <rect x="3" y="6" width="18" height="13" rx="5" />
          <circle cx="12" cy="12.5" r="4" />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {drawing}
    </svg>
  );
}
