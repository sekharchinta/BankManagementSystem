import { X, Printer, CheckCircle2, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionModal({ transaction, isOpen, onClose }) {
  if (!isOpen || !transaction) return null;

  const isDeposit = transaction.transaction_type === "DEPOSIT";
  const isWithdraw = transaction.transaction_type === "WITHDRAW";
  const isTransfer = transaction.transaction_type === "TRANSFER";

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(`TXN-${transaction.id || "10001"}`);
    toast.success("Transaction Reference copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
            isDeposit ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" :
            isWithdraw ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" :
            "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          }`}>
            {isDeposit ? <ArrowDownLeft className="h-8 w-8" /> :
             isWithdraw ? <ArrowUpRight className="h-8 w-8" /> :
             <RefreshCw className="h-7 w-7" />}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Transaction Successful
          </span>
          <h3 className="text-xl font-bold">Transaction Receipt</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apex International Banking Network
          </p>
        </div>

        {/* Amount Section */}
        <div className="my-5 rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Amount
          </p>
          <p className={`text-3xl font-extrabold mt-1 font-mono ${
            isDeposit ? "text-emerald-600 dark:text-emerald-400" :
            isWithdraw ? "text-rose-600 dark:text-rose-400" :
            "text-indigo-600 dark:text-indigo-400"
          }`}>
            {isDeposit ? "+" : "-"}${Number(transaction.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Reference ID</span>
            <div className="flex items-center gap-1 font-mono font-medium">
              <span>TXN-{transaction.id || "10001"}</span>
              <button onClick={handleCopyRef} className="text-indigo-500 hover:text-indigo-600">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Type</span>
            <span className="font-semibold uppercase text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              {transaction.transaction_type}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Account Number</span>
            <span className="font-mono font-semibold">{transaction.account_number || transaction.account || "SB100000001"}</span>
          </div>

          {transaction.balance_after !== undefined && (
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Updated Balance</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ${Number(transaction.balance_after).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Date & Time</span>
            <span className="text-xs font-medium">{new Date(transaction.created_at || Date.now()).toLocaleString()}</span>
          </div>

          <div className="flex justify-between pb-1">
            <span className="text-slate-500 dark:text-slate-400">Description</span>
            <span className="text-xs font-medium text-right max-w-[200px] truncate">{transaction.description || "N/A"}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Printer className="h-4 w-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
