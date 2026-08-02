import { useCallback, useEffect, useMemo, useState } from "react";
import { ListFilter, RotateCcw, Download } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { Select, Field, Input } from "../../components/ui/Field";
import { TransactionBadge, AmountCell, normalizeType } from "../../components/shared/TransactionBadge";
import { useAuth } from "../../context/AuthContext";
import { getHistory } from "../../services/transactions";
import { getErrorMessage } from "../../lib/api";
import { formatAccountNumber, formatCurrency, formatDateTime } from "../../lib/format";
import { downloadCSV } from "../../lib/csv";

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "DEPOSIT", label: "Deposit" },
  { value: "WITHDRAW", label: "Withdraw" },
  { value: "TRANSFER", label: "Transfer" },
];

export default function CustomerTransactions() {
  const { activeAccount } = useAuth();
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeAccount?.account_number) return;
    setLoading(true);
    try {
      const params = {};
      if (start) params.start = start;
      if (end) params.end = end;
      const result = await getHistory(activeAccount.account_number, params);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load transaction history."));
    } finally {
      setLoading(false);
    }
  }, [activeAccount?.account_number, start, end]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!type) return data;
    return data.filter((tx) => normalizeType(tx.transaction_type) === normalizeType(type));
  }, [data, type]);

  const totals = useMemo(() => {
    const summary = { deposit: 0, withdraw: 0, transfer: 0 };
    filtered.forEach((tx) => {
      const key = normalizeType(tx.transaction_type).toLowerCase();
      if (summary[key] !== undefined) summary[key] += Number(tx.amount) || 0;
    });
    return summary;
  }, [filtered]);

  const hasFilters = Boolean(type || start || end);

  const resetFilters = () => {
    setType("");
    setStart("");
    setEnd("");
  };

  const handleExport = () => {
    downloadCSV(
      `transactions-${activeAccount?.account_number}.csv`,
      ["Type", "Amount", "Balance After", "Counterparty", "Description", "Date"],
      filtered.map((tx) => [
        normalizeType(tx.transaction_type),
        tx.amount,
        tx.balance_after_transaction,
        tx.reference_account,
        tx.description,
        tx.created_at,
      ])
    );
    toast.success("CSV downloaded");
  };

  const rows = filtered.map((tx) => ({
    key: tx.id,
    type: <TransactionBadge type={tx.transaction_type} />,
    amount: <AmountCell transaction={tx} />,
    counterparty: tx.reference_account || "—",
    description: tx.description || "—",
    date: formatDateTime(tx.created_at),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle={`History for ${formatAccountNumber(activeAccount?.account_number)}`}
        actions={
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExport}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
        }
      />

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative">
              <ListFilter size={14} className="pointer-events-none absolute left-3 top-[34px] z-10 -translate-y-0 text-slate-400" />
              <Field label="Type">
                <Select value={type} onChange={(e) => setType(e.target.value)} className="h-10 w-full pl-8 text-xs sm:w-44">
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="From">
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-10 text-xs" />
            </Field>

            <Field label="To">
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-10 text-xs" />
            </Field>

            {hasFilters && (
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="text-slate-400">
              {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Deposits <b className="tabular-nums">{formatCurrency(totals.deposit)}</b>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Withdrawals <b className="tabular-nums">{formatCurrency(totals.withdraw)}</b>
            </span>
            <span className="flex items-center gap-1.5 text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Transfers <b className="tabular-nums">{formatCurrency(totals.transfer)}</b>
            </span>
          </div>
        </div>

        <Table
          columns={[
            { key: "type", header: "Type", render: (r) => r.type },
            { key: "amount", header: "Amount", align: "right", render: (r) => r.amount },
            {
              key: "counterparty",
              header: "Counterparty",
              render: (r) => <span className="font-mono text-xs text-slate-600">{r.counterparty}</span>,
            },
            {
              key: "description",
              header: "Description",
              render: (r) => <span className="max-w-[160px] truncate text-slate-500">{r.description}</span>,
            },
            {
              key: "date",
              header: "Date & Time",
              render: (r) => <span className="text-xs text-slate-500">{r.date}</span>,
            },
          ]}
          rows={rows}
          loading={loading}
          emptyTitle="No transactions found"
          emptyDescription="Try adjusting the filters or date range."
        />
      </Card>
    </div>
  );
}
