import { useState } from "react";
import { CheckCircle2, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Field, Input, Textarea } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { customerTransfer } from "../../services/customers";
import { getErrorMessage } from "../../lib/api";
import { formatAccountNumber, formatCurrency } from "../../lib/format";

export default function CustomerTransfer() {
  const { activeAccount, refreshCustomer } = useAuth();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!receiver.trim()) {
      setError("Enter the receiver's account number.");
      return;
    }
    if (!amount || !Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    if (receiver.trim().toUpperCase() === activeAccount.account_number) {
      setError("You cannot transfer to your own account.");
      return;
    }
    if (value > Number(activeAccount.balance || 0)) {
      setError("Insufficient balance for this transfer.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await customerTransfer({
        sender_account_number: activeAccount.account_number,
        receiver_account_number: receiver.trim().toUpperCase(),
        amount: value,
        description: note.trim(),
      });
      setResult(res);
      setReceiver("");
      setAmount("");
      setNote("");
      toast.success("Transfer successful");
      refreshCustomer();
    } catch (err) {
      const message = getErrorMessage(err, "Transfer failed.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer Money"
        subtitle="Send funds to another account"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium text-brand-700">Transferring from</p>
              <p className="font-mono mt-0.5 text-xs font-semibold text-brand-900">
                {formatAccountNumber(activeAccount?.account_number)}
              </p>
            </div>
            <p className="tabular-nums text-lg font-bold text-brand-700">
              {formatCurrency(activeAccount?.balance)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                {error}
              </p>
            )}

            <Field label="Receiver account number" required hint="e.g. SB100000002">
              <Input
                type="text"
                value={receiver}
                onChange={(e) => { setReceiver(e.target.value); setError(""); }}
                placeholder="Enter account number"
                className="font-mono text-sm uppercase"
              />
            </Field>

            <Field label="Amount" required>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₹
                </span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  placeholder="0.00"
                  className="pl-8 text-base font-semibold tabular-nums"
                />
              </div>
            </Field>

            <Field label="Description" hint="Optional note shown to the receiver">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="e.g. Rent payment" />
            </Field>

            <Button type="submit" size="lg" className="w-full" icon={ArrowLeftRight} loading={loading}>
              Transfer Funds
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          {result ? (
            <div className="animate-slide-up rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {result.message || "Transfer successful"}
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-emerald-800">
                    <p className="flex justify-between">
                      <span>To</span>
                      <span className="font-mono font-semibold">{result.receiver?.account_number || "—"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sender balance</span>
                      <span className="font-semibold">{formatCurrency(result.sender?.balance)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card title="Before you send" subtitle="Please double-check">
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Account numbers are case-insensitive.</li>
                <li>Transfers are processed instantly.</li>
                <li>Ensure the receiver's account number is correct — it cannot be reversed.</li>
                <li>Your available balance after transfer is shown in the summary.</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
