import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const ACCENTS = {
  indigo: { bg: "bg-brand-50", icon: "text-brand-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  sky: { bg: "bg-sky-50", icon: "text-sky-600" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600" },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "indigo",
  footer,
  trend,
  loading = false,
}) {
  const accentClasses = ACCENTS[accent] || ACCENTS.indigo;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          {loading ? (
            <span className="skeleton mt-2 block h-8 w-28" />
          ) : (
            <p className="tabular-nums mt-1.5 truncate text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses.bg}`}
        >
          <Icon size={20} className={accentClasses.icon} />
        </div>
      </div>

      {(footer || trend) && (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                trend >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
          {footer && <span className="text-xs text-slate-400">{footer}</span>}
        </div>
      )}
    </div>
  );
}
