import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set([1, total]);
  for (let p = current - 1; p <= current + 1; p += 1) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  return [...pages].sort((a, b) => a - b);
}

export default function Pagination({
  page,
  pageSize = 10,
  total,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pageButtonClass = (active) =>
    `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors ${
      active
        ? "bg-brand-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className={`flex flex-col items-center justify-between gap-3 sm:flex-row ${className}`}>
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showGap = prev && p - prev > 1;
          return (
            <span key={p} className="flex items-center">
              {showGap && (
                <span className="px-1 text-xs text-slate-400">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={pageButtonClass(p === page)}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={15} />
        </button>
      </nav>
    </div>
  );
}
