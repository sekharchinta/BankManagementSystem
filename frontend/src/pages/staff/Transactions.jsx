import { useCallback, useEffect, useState } from "react";
import { ArrowDownWideNarrow, ListFilter, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { TransactionBadge, AmountCell } from "../../components/shared/TransactionBadge";
import { listTransactions } from "../../services/transactions";
import { getErrorMessage } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "DEPOSIT", label: "Deposit" },
  { value: "WITHDRAW", label: "Withdraw" },
  { value: "TRANSFER", label: "Transfer" },
];

const ORDER_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "-amount", label: "Highest amount" },
  { value: "amount", label: "Lowest amount" },
];

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const debouncedSearch = useDebounce(search);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, ordering };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (type) params.transaction_type = type;
      const result = await listTransactions(params);
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load transactions."));
    } finally {
      setLoading(false);
    }
  }, [page, ordering, debouncedSearch, type]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, ordering]);

  const resetFilters = () => {
    setSearch("");
    setType("");
    setOrdering("-created_at");
  };

  const rows = (data?.results || []).map((tx) => ({
    key: tx.id,
    tx,
  }));

  const hasFilters = Boolean(search.trim() || type || ordering !== "-created_at");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Complete audit trail of all banking activity"
      />

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by account or description..."
              className="w-full sm:w-64"
            />
            <div className="flex items-center gap-2">
              <div className="relative">
                <ListFilter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-10 w-full pl-8 text-xs sm:w-40"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="relative">
                <ArrowDownWideNarrow size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="h-10 w-full pl-8 text-xs sm:w-44"
                >
                  {ORDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>
          {data && (
            <p className="text-xs text-slate-400">
              {data.count} transaction{data.count === 1 ? "" : "s"} found
            </p>
          )}
        </div>

        <Table
          columns={[
            {
              key: "type",
              header: "Type",
              render: (r) => <TransactionBadge type={r.tx.transaction_type} />,
            },
            {
              key: "account",
              header: "Account",
              render: (r) => (
                <span className="font-mono text-xs font-medium text-slate-900">{r.tx.account_number}</span>
              ),
            },
            {
              key: "amount",
              header: "Amount",
              align: "right",
              render: (r) => <AmountCell transaction={r.tx} />,
            },
            {
              key: "balance_after_transaction",
              header: "Balance After",
              align: "right",
              render: (r) => (
                <span className="tabular-nums text-slate-500">
                  {formatCurrency(r.tx.balance_after_transaction)}
                </span>
              ),
            },
            {
              key: "reference_account",
              header: "Counterparty",
              render: (r) =>
                r.tx.reference_account ? (
                  <span className="font-mono text-xs text-slate-600">{r.tx.reference_account}</span>
                ) : (
                  <span className="text-slate-300">—</span>
                ),
            },
            {
              key: "description",
              header: "Description",
              render: (r) => (
                <span className="max-w-[180px] truncate text-slate-500">{r.tx.description || "—"}</span>
              ),
            },
            {
              key: "created_at",
              header: "Date & Time",
              render: (r) => <span className="text-xs text-slate-500">{formatDateTime(r.tx.created_at)}</span>,
            },
          ]}
          rows={rows}
          loading={loading}
          emptyTitle="No transactions found"
          emptyDescription="Try adjusting your filters or search."
        />

        {data && data.count > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <Pagination page={page} total={data.count} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}
