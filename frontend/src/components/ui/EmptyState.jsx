import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display.",
  action,
  icon,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">

      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        {icon || <Inbox size={40} className="text-slate-400" />}
      </div>

      <h2 className="text-xl font-semibold text-slate-800">
        {title}
      </h2>

      <p className="text-slate-500 mt-2 max-w-md">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}