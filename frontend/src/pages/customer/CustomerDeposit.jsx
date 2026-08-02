import { useState } from "react";
import { CheckCircle2, ArrowDownCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import HiddenBalance from "../../components/ui/HiddenBalance";
import { Field, Input, Textarea } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { customerDeposit } from "../../services/customers";
import { getErrorMessage } from "../../lib/api";
import { formatAccountNumber } from "../../lib/format";

export default function CustomerDeposit() {
  const { activeAccount, refreshCustomer } = useAuth();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await customerDeposit({
        account_number: activeAccount.account_number,
        amount: value,
        description: note.trim(),
      });
      setResult(res);
      setAmount("");
      setNote("");
      toast.success("Deposit successful");
      try {
        await refreshCustomer();
      } catch {
        /* balance refresh is best-effort */
      }
    } catch (err) {
      const message = getErrorMessage(err, "Deposit failed.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit"
        subtitle="Add money to your own account"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium text-emerald-700">Depositing into</p>
              <p className="font-mono mt-0.5 text-xs font-semibold text-emerald-900">
                {formatAccountNumber(activeAccount?.account_number)}
              </p>
            </div>
            <HiddenBalance
              value={activeAccount?.balance}
              className="text-lg font-bold text-emerald-700"
              iconSize={15}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                {error}
              </p>
            )}

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

            <Field label="Description" hint="Optional note">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note (optional)" />
            </Field>

            <Button type="submit" size="lg" className="w-full" icon={ArrowDownCircle} loading={loading}>
              Deposit Money
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
                    {result.message || "Deposit successful"}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Your current balance is{" "}
                    <HiddenBalance
                      value={result.current_balance}
                      iconSize={12}
                      className="font-bold text-emerald-800"
                    />
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Card title="Deposit Summary" subtitle="Money is credited instantly">
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Funds appear in your balance immediately.</li>
                <li>A deposit transaction is recorded for your statement.</li>
                <li>No fees apply for self-deposits.</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
