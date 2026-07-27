import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "text-indigo-600 dark:text-indigo-400",
  bg = "bg-indigo-50 dark:bg-indigo-950/60",
  trend,
  trendLabel,
  actionLabel,
  onAction,
}) {
  const isTrendPositive = trend ? trend >= 0 : true;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 group fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} shadow-sm group-hover:scale-110 transition-transform`}>
          {Icon && <Icon size={22} className={`${color}`} />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isTrendPositive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          }`}>
            {isTrendPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>

      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
        {value}
      </h3>

      {trendLabel && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
          {trendLabel}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 mt-3 inline-flex items-center gap-1"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}