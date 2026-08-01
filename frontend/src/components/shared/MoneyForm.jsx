import { useState } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Card from "../ui/Card";
import AccountPicker from "./AccountPicker";
import { Field, Input, Textarea } from "../ui/Field";
import { useAsync } from "../../hooks/useAsync";
import { reportAccounts } from "../../services/reports";
import { deposit, withdraw, transfer } from "../../services/transactions";
import { getErrorMessage } from "../../lib/api";
import { formatCurrency } from "../../lib/format";

const CONFIG = {
  deposit: {
    title: "Cash Deposit",
    subtitle: "Credit funds into a customer's account",
    submitLabel: "Deposit Money",
    successVerb: "deposited",
  },
  withdraw: {
    title: "Cash Withdrawal",
    subtitle: "Debit funds from a customer's account",
    submitLabel: "Withdraw Money",
    successVerb: "withdrawn",
  },
  transfer: {
    title: "Fund Transfer",
    subtitle: "Move money between two accounts",
    submitLabel: "Transfer Funds",
    successVerb: "transferred",
  },
};

export default function MoneyForm({ mode }) {
  const config = CONFIG[mode];
  const accounts = useAsync(() => reportAccounts(), []);

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const accountList = accounts.data || [];
  const fromAccountData = accountList.find((a) => a.account_number === fromAccount);

  const validate = () => {
    const next = {};
    if (!fromAccount) next.fromAccount = "Please select an account.";
    if (mode === "transfer") {
      if (!toAccount) next.toAccount = "Please select a destination account.";
      else if (toAccount === fromAccount)
        next.toAccount = "Sender and receiver cannot be the same.";
    }
    const amountValue = Number(amount);
    if (!amount || !Number.isFinite(amountValue) || amountValue <= 0)
      next.amount = "Enter a valid amount greater than zero.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const amountValue = Number(amount);
      const payload = { amount: amountValue, description: note.trim() };
      let res;
      if (mode === "deposit") {
        res = await deposit({ ...payload, account_number: fromAccount });
      } else if (mode === "withdraw") {
        res = await withdraw({ ...payload, account_number: fromAccount });
      } else {
        res = await transfer({ ...payload, from_account: fromAccount, to_account: toAccount });
      }
      setResult(res.data || res);
      toast.success(`Money ${config.successVerb} successfully`);
      setAmount("");
      setNote("");
      accounts.refetch();
    } catch (err) {
      const message = getErrorMessage(err, "Transaction failed.");
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
              {errors.form}
            </p>
          )}

          <AccountPicker
            label={mode === "transfer" ? "From account" : "Account"}
            accounts={accountList}
            value={fromAccount}
            onChange={(v) => { setFromAccount(v); setErrors((e) => ({ ...e, fromAccount: "" })); }}
            loading={accounts.loading}
            error={errors.fromAccount}
            invalid={Boolean(errors.fromAccount)}
          />

          {fromAccountData && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                <Wallet size={14} />
                Current balance
              </span>
              <span className="tabular-nums text-sm font-bold text-emerald-700">
                {formatCurrency(fromAccountData.balance)}
              </span>
            </div>
          )}

          {mode === "transfer" && (
            <AccountPicker
              label="To account"
              accounts={accountList}
              value={toAccount}
              onChange={(v) => { setToAccount(v); setErrors((e) => ({ ...e, toAccount: "" })); }}
              loading={accounts.loading}
              error={errors.toAccount}
              invalid={Boolean(errors.toAccount)}
            />
          )}

          <Field label="Amount" required error={errors.amount}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors((e) => ({ ...e, amount: "" })); }}
                placeholder="0.00"
                className="pl-8 text-base font-semibold tabular-nums"
              />
            </div>
          </Field>

          <Field label="Description" hint="Optional note for the transaction record">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={config.subtitle}
            />
          </Field>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {config.submitLabel}
          </Button>
        </form>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card title="Transaction Preview" subtitle="Review before you confirm">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Type</dt>
              <dd className="font-semibold text-slate-900">{config.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">From account</dt>
              <dd className="font-mono text-xs font-medium text-slate-900">
                {fromAccount || "—"}
              </dd>
            </div>
            {mode === "transfer" && (
              <div className="flex justify-between">
                <dt className="text-slate-500">To account</dt>
                <dd className="font-mono text-xs font-medium text-slate-900">
                  {toAccount || "—"}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Amount</dt>
              <dd className="tabular-nums text-base font-bold text-slate-900">
                {amount ? formatCurrency(amount) : "—"}
              </dd>
            </div>
          </dl>
        </Card>

        {result && (
          <div className="animate-slide-up rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-900">
                  {result.message || "Transaction completed"}
                </p>
                <div className="mt-3 space-y-1.5 text-xs text-emerald-800">
                  {result.current_balance !== undefined && (
                    <p className="flex justify-between">
                      <span>Current balance</span>
                      <span className="font-semibold">{formatCurrency(result.current_balance)}</span>
                    </p>
                  )}
                  {result.sender && (
                    <p className="flex justify-between">
                      <span>Sender balance</span>
                      <span className="font-semibold">{formatCurrency(result.sender.balance)}</span>
                    </p>
                  )}
                  {result.receiver && (
                    <p className="flex justify-between">
                      <span>Receiver balance</span>
                      <span className="font-semibold">{formatCurrency(result.receiver.balance)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
