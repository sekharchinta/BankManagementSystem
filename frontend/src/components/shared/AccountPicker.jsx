import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { formatAccountNumber, formatCurrency } from "../../lib/format";
import Spinner from "../ui/Spinner";

export default function AccountPicker({
  accounts = [],
  value,
  onChange,
  placeholder = "Select an account...",
  loading = false,
  error,
  label,
  invalid = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = accounts.find((a) => a.account_number === value);

  const filtered = accounts.filter((account) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      account.account_number?.toLowerCase().includes(q) ||
      account.customer_name?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 text-left text-sm shadow-sm transition-colors focus:outline-none focus:ring-4 ${
          invalid
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Spinner size={14} /> Loading accounts...
          </span>
        ) : selected ? (
          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span className="font-medium text-slate-900">
              {formatAccountNumber(selected.account_number)}
            </span>
            <span className="truncate text-xs text-slate-500">
              {selected.customer_name}
            </span>
          </span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <ChevronsUpDown size={16} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by number or name..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-slate-400">
                No matching accounts
              </li>
            )}
            {filtered.map((account) => {
              const isSelected = account.account_number === value;
              return (
                <li key={account.account_number}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(account.account_number);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                      isSelected ? "bg-brand-50" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-slate-900">
                        {formatAccountNumber(account.account_number)}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {account.customer_name} · {account.account_type}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="tabular-nums text-xs font-semibold text-slate-700">
                        {formatCurrency(account.balance)}
                      </span>
                      {isSelected && <Check size={15} className="text-brand-600" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
