import Badge, { statusTone } from "../ui/Badge";
import { TRANSACTION_TYPES } from "../../lib/constants";

export function normalizeType(type) {
  const key = String(type || "").toUpperCase();
  return TRANSACTION_TYPES[key] || key || "—";
}

export function TransactionBadge({ type }) {
  const label = normalizeType(type);
  return <Badge tone={statusTone(label)} dot>{label}</Badge>;
}

export function AmountCell({ transaction, compact = false }) {
  const type = normalizeType(transaction.transaction_type);
  const amount = Number(transaction.amount) || 0;
  const isCredit = type === "Deposit" || type === "Transfer";
  const sign = isCredit ? "+" : "−";

  return (
    <span
      className={`tabular-nums font-semibold ${
        isCredit ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {sign}
      {amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
