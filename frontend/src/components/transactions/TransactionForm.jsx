import { useState, useEffect } from "react";
import { getAccounts } from "../../services/accountService";
import TransactionModal from "../common/TransactionModal";
import { DollarSign, Search, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionForm({
  title,
  buttonText,
  onSubmit,
  type = "DEPOSIT", // 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'
}) {
  const [accountNumber, setAccountNumber] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [accounts, setAccounts] = useState([]);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchAccountsList();
  }, []);

  const fetchAccountsList = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data?.results || data || []);
    } catch (err) {
      console.error("Failed to load accounts list:", err);
    }
  };

  const selectedAccountObj = accounts.find((a) => a.account_number === accountNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      toast.error("Please enter or select an account number.");
      return;
    }

    if (type === "TRANSFER" && !receiverAccount.trim()) {
      toast.error("Please enter recipient account number.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        account_number: accountNumber.trim(),
        receiver_account_number: receiverAccount.trim(),
        amount: numAmount,
        description: description.trim() || `${type} transaction by Staff`,
      };

      const res = await onSubmit(payload);
      
      toast.success(`${type} transaction executed successfully!`);

      // Prepare transaction receipt object
      const txObj = {
        id: Math.floor(100000 + Math.random() * 900000),
        transaction_type: type,
        account_number: accountNumber.trim(),
        amount: numAmount,
        balance_after: res?.current_balance || res?.sender?.balance || (selectedAccountObj ? selectedAccountObj.balance : 0),
        description: description.trim() || `${type} transaction`,
        created_at: new Date().toISOString(),
      };
      setReceipt(txObj);

      // Reset amount field
      setAmount("");
      setDescription("");
      fetchAccountsList();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || `${type} execution failed. Check account details.`;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [100, 250, 500, 1000, 2500];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Form Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff Ledger Operation
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Account Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select or Enter Account Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SB100000001"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.toUpperCase())}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
              {accounts.length > 0 && (
                <select
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none max-w-[180px]"
                >
                  <option value="">Select Existing Account</option>
                  {accounts.map((acc) => (
                    <option key={acc.account_number} value={acc.account_number}>
                      {acc.account_number} (${Number(acc.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedAccountObj && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 p-2.5 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Holder: <strong className="text-slate-900 dark:text-slate-100">{selectedAccountObj.customer_name || "Customer"}</strong> ({selectedAccountObj.account_type})
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Current Balance: ${Number(selectedAccountObj.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Receiver Account (if Transfer) */}
          {type === "TRANSFER" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Recipient Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. SB100000002"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value.toUpperCase())}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Amount ($ USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 font-mono text-xl font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Quick Pills */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 self-center font-medium mr-1">Presets:</span>
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                >
                  +${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Transaction Remark / Notes
            </label>
            <input
              type="text"
              placeholder="Internal staff transaction notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing Ledger Entry..." : <>{buttonText} <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionModal
        transaction={receipt}
        isOpen={!!receipt}
        onClose={() => setReceipt(null)}
      />
    </div>
  );
}