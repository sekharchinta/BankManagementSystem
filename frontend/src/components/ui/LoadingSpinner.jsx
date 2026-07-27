import React from "react";
import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
}) {

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-10">

      <LoaderCircle
        size={40}
        className="animate-spin text-blue-600"
      />

      <p className="text-slate-500">
        {text}
      </p>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}