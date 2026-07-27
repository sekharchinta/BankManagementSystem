import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "bg-blue-100",
  iconColor = "text-blue-600",
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${color}`}
        >
          <div className={iconColor}>
            {icon}
          </div>
        </div>

      </div>

    </div>
  );
}