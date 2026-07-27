import React from "react";

export default function Card({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-6
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6">

          {title && (
            <h2 className="text-xl font-semibold text-slate-800">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>
      )}

      {children}

    </div>
  );
}