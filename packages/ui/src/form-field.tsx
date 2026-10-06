import type { ReactNode } from "react";

export interface FormFieldProps {
  children: ReactNode;
  error?: string | undefined;
  hint?: string | undefined;
  htmlFor: string;
  label: string;
}

export function FormField({
  children,
  error,
  hint,
  htmlFor,
  label,
}: FormFieldProps) {
  const descriptionId = `${htmlFor}-description`;

  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium text-slate-800"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={descriptionId}
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
