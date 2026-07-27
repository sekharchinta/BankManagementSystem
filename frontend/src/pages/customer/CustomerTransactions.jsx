import { useState, useEffect } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { fetchCustomerTransactionsApi } from "../../services/customerService";
import TransactionModal from "../../components/common/TransactionModal";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw,
  Receipt
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerTransactions() {
  const { activeAccount } = useCustomerAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (activeAccount?.account_number) {
      loadTransactions(activeAccount.account_number);
    }
  }, [activeAccount]);

  const loadTransactions = async (accountNumber) => {
    setLoading(true);
    try {
      const data = await fetchCustomerTransactionsApi(accountNumber);
      setTransactions(data || []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      toast.error("Failed to load account transaction history.");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.account_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id?.toString().includes(searchQuery);

    const matchesType = selectedType === "ALL" || tx.transaction_type === selectedType;

    return matchesSearch && matchesType;
  });

  // CSV Export feature
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export.");
      return;
    }

    const headers = ["Transaction ID,Type,Amount,Updated Balance,Description,Date"];
    const rows = filteredTransactions.map((tx) => 
      `"${tx.id}","${tx.transaction_type}","${tx.amount}","${tx.balance_after || ""}","${tx.description || ""}","${new Date(tx.created_at).toLocaleString()}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Statement_${activeAccount?.account_number || "Account"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Transaction statement exported as CSV!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> Account Statement & History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Account: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeAccount?.account_number}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Export CSV Statement
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            <Printer className="h-4 w-4" /> Print Page
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description, reference or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                selectedType === type
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="rounded-2xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-12 w-full skeleton" />
            <div className="h-12 w-full skeleton" />
            <div className="h-12 w-full skeleton" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <History className="mx-auto h-10 w-10 opacity-40 mb-2" />
            <p className="text-sm font-semibold">No transaction records found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Txn ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Balance After</th>
                  <th className="py-3.5 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => {
                  const isDeposit = tx.transaction_type === "DEPOSIT";
                  const isWithdraw = tx.transaction_type === "WITHDRAW";
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        #{tx.id}
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
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[220px] truncate">
                        {tx.description || "Bank Transaction"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-4 font-mono font-bold text-right text-sm ${
                        isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {isDeposit ? "+" : "-"}${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-right text-slate-700 dark:text-slate-300">
                        {tx.balance_after !== undefined ? `$${Number(tx.balance_after).toFixed(2)}` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800 transition"
                        >
                          <Receipt className="h-3 w-3" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
