import { Landmark } from "lucide-react";

export default function Logo({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-9 w-9 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  };
  const iconSizes = { sm: 16, md: 20, lg: 24 };

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-600/30 ${sizes[size]} ${className}`}
    >
      <Landmark size={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
}
