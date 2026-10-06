import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", hasError = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={hasError || undefined}
      className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
        hasError
          ? "border-red-400 ring-2 ring-red-100 focus:border-red-500"
          : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      } ${className}`}
      {...props}
    />
  );
});
