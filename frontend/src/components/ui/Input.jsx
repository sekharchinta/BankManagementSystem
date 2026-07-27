import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Input({
  label,
  error,
  success,
  disabled = false,
  required = false,
  helpText,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">

      {label && (
        <label className="block mb-2 text-sm font-semibold text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">

        <input
          {...props}
          disabled={disabled}
          className={`
            w-full
            rounded-lg
            border-2
            bg-white
            px-4
            py-2.5
            text-slate-700
            placeholder:text-slate-400
            font-medium
            transition-all
            duration-200
            outline-none
            disabled:bg-slate-100
            disabled:text-slate-500
            disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                : success
                ? "border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            }
            ${className}
          `}
        />

        {error && (
          <AlertCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
        )}

        {success && !error && (
          <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
        )}

      </div>

      {error && (
        <div className="mt-2 flex items-start gap-2">
          <p className="text-sm text-red-600 font-medium">
            {error}
          </p>
        </div>
      )}

      {helpText && !error && (
        <p className="mt-1 text-xs text-slate-500">
          {helpText}
        </p>
      )}

    </div>
  );
}