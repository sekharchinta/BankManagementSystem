import React from "react";

export default function Badge({
  children,
  variant = "primary",
}) {

  const variants = {

    primary:
      "bg-blue-100 text-blue-700",

    success:
      "bg-emerald-100 text-emerald-700",

    danger:
      "bg-red-100 text-red-700",

    warning:
      "bg-amber-100 text-amber-700",

    secondary:
      "bg-slate-100 text-slate-700",

  };

  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>

  );
}