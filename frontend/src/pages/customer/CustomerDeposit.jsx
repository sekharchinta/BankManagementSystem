import { useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { customerDepositApi } from "../../services/customerService";
import TransactionModal from "../../components/common/TransactionModal";
import { PlusCircle, CreditCard, Landmark, QrCode, CheckCircle2, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDeposit() {
  const { activeAccount, refreshCustomerData } = useCustomerAuth();
  
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("DEBIT_CARD");
  const [loading, setLoading] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState(null);

  const presetAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!activeAccount?.account_number) {
      toast.error("Account number missing.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await customerDepositApi({
        account_number: activeAccount.account_number,
        amount: numAmount,
        description: `Online Deposit via ${paymentMethod.replace("_", " ")}`,
      });

      toast.success("Funds Added to Account Successfully!");
      await refreshCustomerData();

      if (res.transaction) {
        setRecentReceipt(res.transaction);
      } else {
        setRecentReceipt({
          id: Math.floor(100000 + Math.random() * 900000),
          transaction_type: "DEPOSIT",
          account_number: activeAccount.account_number,
          amount: numAmount,
          balance_after: res.current_balance || (parseFloat(activeAccount.balance) + numAmount),
          description: `Deposit via ${paymentMethod.replace("_", " ")}`,
          created_at: new Date().toISOString(),
        });
      }

      setAmount("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Deposit failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" /> Add Funds to Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate depositing funds into your account using standard digital payment channels.
        </p>
      </div>

      {/* Main Deposit Form Card */}
      <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleDeposit} className="space-y-6">
          
          {/* Target Account Badge */}
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Destination Account</p>
              <p className="font-mono text-base font-bold text-slate-800 dark:text-slate-200">
                {activeAccount?.account_number || "SB100000001"} ({activeAccount?.account_type || "Savings"})
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase">Current Balance</p>
              <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ${Number(activeAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Select Deposit Payment Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "DEBIT_CARD", title: "Debit / Credit Card", icon: CreditCard, desc: "Instant Deposit" },
                { id: "NET_BANKING", title: "Net Banking", icon: Landmark, desc: "Direct Bank Link" },
                { id: "UPI_QR", title: "UPI / Scan & Pay", icon: QrCode, desc: "Mobile Payment" },
              ].map((method) => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition ${
                      selected
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 dark:border-emerald-500 ring-2 ring-emerald-500"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                      {selected && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{method.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{method.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Deposit Amount ($ USD)
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
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 font-mono text-xl font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 self-center mr-1 font-medium">Select Amount:</span>
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-emerald-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                >
                  +${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Processing Deposit..." : "Confirm & Deposit Funds"}
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
