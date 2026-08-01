const TONES = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/25",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  indigo: "bg-brand-50 text-brand-700 ring-brand-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const DOT_COLORS = {
  green: "bg-emerald-500",
  red: "bg-rose-500",
  amber: "bg-amber-500",
  blue: "bg-sky-500",
  indigo: "bg-brand-500",
  violet: "bg-violet-500",
  slate: "bg-slate-400",
};

export default function Badge({ tone = "slate", children, dot = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[tone]}`} />}
      {children}
    </span>
  );
}

/** Pick a badge tone based on a transaction/status string. */
export function statusTone(value = "") {
  const key = String(value).toLowerCase();
  if (key.includes("deposit") || key === "active" || key === "savings") return "green";
  if (key.includes("withdraw") || key === "inactive") return "red";
  if (key.includes("transfer")) return "indigo";
  return "slate";
}
