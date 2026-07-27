import { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Receipt,
  Download
} from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TransactionModal from "../components/common/TransactionModal";
import toast from "react-hot-toast";
import { getTransactions } from "../services/transactionService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.results || data || []);
    } catch (error) {
      toast.error("Failed to load transaction history.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const accNum = tx.account_number || tx.account || "";
    const matchesSearch =
      accNum.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id?.toString().includes(searchTerm);

    const matchesType =
      filterType === "ALL" ||
      tx.transaction_type === filterType ||
      (filterType === "WITHDRAW" && tx.transaction_type === "DEBIT") ||
      (filterType === "DEPOSIT" && tx.transaction_type === "CREDIT");

    return matchesSearch && matchesType;
  });

  if (loading) return <LoadingSpinner text="Loading transaction audit history..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> System Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time audit log of all system deposits, withdrawals, and account transfers.
          </p>
        </div>

        <button
          onClick={loadTransactions}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Ledger
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by account number, remark, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                filterType === type
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Txn Ref</th>
                <th className="py-3.5 px-4">Account Number</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                    No transaction entries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const isDeposit = tx.transaction_type === "DEPOSIT" || tx.transaction_type === "CREDIT";
                  const isWithdraw = tx.transaction_type === "WITHDRAW" || tx.transaction_type === "DEBIT";
                  return (
                    <tr key={tx.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        #{tx.id || (1000 + idx)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {tx.account_number || tx.account || "SB100000001"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isDeposit ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                          isWithdraw ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" :
                          "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                        }`}>
                          {isDeposit ? <ArrowDownLeft className="h-3 w-3" /> :
                           isWithdraw ? <ArrowUpRight className="h-3 w-3" /> :
                           <RefreshCw className="h-3 w-3" />}
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                        {tx.description || "System Transaction"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(tx.created_at || tx.transaction_date || Date.now()).toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-4 font-mono font-extrabold text-right text-sm ${
                        isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {isDeposit ? "+" : "-"}${Number(tx.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800 transition"
                        >
                          <Receipt className="h-3 w-3" /> View
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

      {/* Transaction Receipt Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}