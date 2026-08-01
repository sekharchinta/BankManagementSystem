import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const baseFieldClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

function fieldClass(error) {
  return `${baseFieldClass} ${
    error
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
  }`;
}

export function Field({ label, error, hint, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { error, className = "", ...props },
  ref
) {
  return <input ref={ref} className={`${fieldClass(error)} ${className}`} {...props} />;
});

export const Select = forwardRef(function Select(
  { error, className = "", children, ...props },
  ref
) {
  return (
    <select ref={ref} className={`${fieldClass(error)} ${className}`} {...props}>
      {children}
    </select>
  );
});

export const Textarea = forwardRef(function Textarea(
  { error, className = "", rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${fieldClass(error)} ${className}`}
      {...props}
    />
  );
});
