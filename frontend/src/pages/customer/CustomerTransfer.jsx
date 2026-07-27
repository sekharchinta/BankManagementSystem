import { useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { customerTransferApi } from "../../services/customerService";
import TransactionModal from "../../components/common/TransactionModal";
import { Send, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerTransfer() {
  const { activeAccount, accounts, setActiveAccount, refreshCustomerData } = useCustomerAuth();
  
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Online Transfer");
  const [loading, setLoading] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState(null);

  const presetAmounts = [50, 100, 250, 500, 1000];

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!activeAccount?.account_number) {
      toast.error("Please select a valid sender account.");
      return;
    }

    if (!receiverAccount.trim()) {
      toast.error("Please enter a valid recipient account number.");
      return;
    }

    if (receiverAccount.trim().toUpperCase() === activeAccount.account_number.toUpperCase()) {
      toast.error("You cannot transfer money to the same account.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than $0.");
      return;
    }

    if (numAmount > parseFloat(activeAccount.balance)) {
      toast.error("Insufficient account balance for this transfer.");
      return;
    }

    setLoading(true);
    try {
      const res = await customerTransferApi({
        sender_account_number: activeAccount.account_number,
        receiver_account_number: receiverAccount.trim(),
        amount: numAmount,
        description: description.trim() || "Customer Money Transfer",
      });

      toast.success("Transfer Completed Successfully!");
      
      // Update customer local context data
      await refreshCustomerData();

      // Show receipt modal
      if (res.transaction) {
        setRecentReceipt(res.transaction);
      } else {
        setRecentReceipt({
          id: Math.floor(100000 + Math.random() * 900000),
          transaction_type: "TRANSFER",
          account_number: activeAccount.account_number,
          amount: numAmount,
          balance_after: res.sender?.balance || (parseFloat(activeAccount.balance) - numAmount),
          description: `Transfer to ${receiverAccount.trim()}`,
          created_at: new Date().toISOString(),
        });
      }

      // Reset form fields
      setReceiverAccount("");
      setAmount("");
      setDescription("Online Transfer");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Transfer failed. Please check recipient account.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Send className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> Send Money & Transfers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transfer money instantly to any Apex Bank account with zero processing fees.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full font-semibold">
          <ShieldCheck className="h-4 w-4" /> Instant Settlement
        </div>
      </div>

      {/* Transfer Form Card */}
      <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleTransfer} className="space-y-5">
          
          {/* Sender Account Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              From Account (Sender)
            </label>
            <select
              value={activeAccount?.account_number || ""}
              onChange={(e) => {
                const selected = accounts.find((a) => a.account_number === e.target.value);
                if (selected) setActiveAccount(selected);
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {accounts.map((acc) => (
                <option key={acc.account_number} value={acc.account_number}>
                  {acc.account_number} ({acc.account_type}) - Balance: ${Number(acc.balance).toFixed(2)}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Available Balance:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ${Number(activeAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Recipient Account Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              To Account Number (Recipient)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. SB100000002"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value.toUpperCase())}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Enter the recipient's 11-digit bank account number.
            </p>
          </div>

          {/* Transfer Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Transfer Amount ($ USD)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400">
                <DollarSign className="h-5 w-5" />
              </div>
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

            {/* Quick Amount Selectors */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 self-center mr-1 font-medium">Quick Select:</span>
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

          {/* Remark / Note Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Payment Remark / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Rent Payment, Project Fee, Gift"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <span>Processing Transfer...</span>
            ) : (
              <>
                <span>Execute Transfer Now</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionModal
        transaction={recentReceipt}
        isOpen={!!recentReceipt}
        onClose={() => setRecentReceipt(null)}
      />
    </div>
  );
}
