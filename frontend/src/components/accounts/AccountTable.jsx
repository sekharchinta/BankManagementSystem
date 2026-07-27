import { useState } from "react";
import { Search, Eye, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AccountTable({ accounts, onViewBalance }) {
  const [search, setSearch] = useState("");

  const filteredAccounts = accounts.filter((acc) => {
    const term = search.toLowerCase();
    return (
      acc.account_number?.toLowerCase().includes(term) ||
      acc.customer_name?.toLowerCase().includes(term) ||
      acc.account_type?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter accounts by number, customer, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      {/* Account Table */}
      <div className="rounded-2xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Account Number</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Balance</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isActive = account.status === "Active" || !account.status;
                  return (
                    <tr key={account.account_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {account.account_number}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 capitalize">
                        {account.customer_name || "Valued Customer"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {account.account_type || "Savings"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}>
                          {isActive ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                          {account.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-right text-emerald-600 dark:text-emerald-400">
                        ${Number(account.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onViewBalance(account.account_number)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800 transition"
                        >
                          <Eye size={13} /> View Live
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}