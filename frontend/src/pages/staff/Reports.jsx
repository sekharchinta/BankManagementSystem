import { useCallback, useRef, useState } from "react";
import { Download, Printer, Users, Landmark, ReceiptText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge, { statusTone } from "../../components/ui/Badge";
import { TransactionBadge, AmountCell } from "../../components/shared/TransactionBadge";
import {
  reportCustomers,
  reportAccounts,
  reportTransactions,
} from "../../services/reports";
import { downloadCSV } from "../../lib/csv";
import { formatDate, formatCurrency, formatDateTime } from "../../lib/format";
import { useAsync } from "../../hooks/useAsync";

const TABS = [
  { key: "customers", label: "Customers", icon: Users },
  { key: "accounts", label: "Accounts", icon: Landmark },
  { key: "transactions", label: "Transactions", icon: ReceiptText },
];

const CONFIG = {
  customers: {
    csvName: "customers-report.csv",
    csvHeaders: ["ID", "Full Name", "Email", "Phone", "Address", "Date of Birth", "Account Number", "Created At"],
    columns: [
      { key: "id", header: "ID" },
      { key: "full_name", header: "Name", render: (r) => <span className="font-medium text-slate-900">{r.full_name}</span> },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { key: "address", header: "Address", render: (r) => <span className="max-w-[200px] truncate text-slate-500">{r.address || "—"}</span> },
      { key: "account_number", header: "Account", render: (r) => <span className="font-mono text-xs">{r.account_number || "—"}</span> },
      { key: "date_of_birth", header: "DOB", render: (r) => <span className="text-slate-500">{formatDate(r.date_of_birth)}</span> },
      { key: "created_at", header: "Created", render: (r) => <span className="text-slate-500">{formatDate(r.created_at)}</span> },
    ],
    toCsvRow: (r) => [
      r.id,
      r.full_name,
      r.email,
      r.phone,
      r.address,
      r.date_of_birth,
      r.account_number || "",
      r.created_at,
    ],
  },
  accounts: {
    csvName: "accounts-report.csv",
    csvHeaders: ["Account Number", "Customer", "Type", "Balance", "Status", "Created At"],
    columns: [
      { key: "account_number", header: "Account", render: (r) => <span className="font-mono text-xs font-medium">{r.account_number}</span> },
      { key: "customer_name", header: "Customer", render: (r) => <span className="font-medium text-slate-900">{r.customer_name}</span> },
      { key: "account_type", header: "Type", render: (r) => <Badge tone={statusTone(r.account_type)}>{r.account_type}</Badge> },
      { key: "balance", header: "Balance", align: "right", render: (r) => <span className="tabular-nums font-semibold">{formatCurrency(r.balance)}</span> },
      { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status)} dot>{r.status}</Badge> },
      { key: "created_at", header: "Created", render: (r) => <span className="text-slate-500">{formatDate(r.created_at)}</span> },
    ],
    toCsvRow: (r) => [r.account_number, r.customer_name, r.account_type, r.balance, r.status, r.created_at],
  },
  transactions: {
    csvName: "transactions-report.csv",
    csvHeaders: ["ID", "Account", "Type", "Amount", "Balance After", "Counterparty", "Description", "Created At"],
    columns: [
      { key: "id", header: "ID" },
      { key: "account_number", header: "Account", render: (r) => <span className="font-mono text-xs">{r.account_number}</span> },
      { key: "transaction_type", header: "Type", render: (r) => <TransactionBadge type={r.transaction_type} /> },
      { key: "amount", header: "Amount", align: "right", render: (r) => <AmountCell transaction={r} /> },
      { key: "balance_after_transaction", header: "Balance After", align: "right", render: (r) => <span className="tabular-nums text-slate-500">{formatCurrency(r.balance_after_transaction)}</span> },
      { key: "reference_account", header: "Counterparty", render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference_account || "—"}</span> },
      { key: "description", header: "Description", render: (r) => <span className="max-w-[180px] truncate text-slate-500">{r.description || "—"}</span> },
      { key: "created_at", header: "Date & Time", render: (r) => <span className="text-xs text-slate-500">{formatDateTime(r.created_at)}</span> },
    ],
    toCsvRow: (r) => [r.id, r.account_number, r.transaction_type, r.amount, r.balance_after_transaction, r.reference_account, r.description, r.created_at],
  },
};

export default function Reports() {
  const [tab, setTab] = useState("customers");
  const fetched = useRef({});
  const [cache, setCache] = useState({});

  const fetchers = {
    customers: () => reportCustomers(),
    accounts: () => reportAccounts(),
    transactions: () => reportTransactions(),
  };

  const loader = useCallback(async () => {
    if (fetched.current[tab]) return cache[tab];
    const data = await fetchers[tab]();
    fetched.current[tab] = true;
    setCache((prev) => ({ ...prev, [tab]: data }));
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const { data, loading } = useAsync(loader, [loader]);

  const config = CONFIG[tab];
  const tableRows = (data || []).map(config.toCsvRow);

  const handleExport = () => {
    downloadCSV(config.csvName, config.csvHeaders, tableRows);
    toast.success("CSV downloaded");
  };

  const totalBalance = (data || []).reduce((sum, item) => sum + (Number(item.balance) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Full data extracts for analysis, export, and printing"
        actions={
          <>
            <Button variant="outline" icon={Download} onClick={handleExport} disabled={loading || (data?.length ?? 0) === 0}>
              Export CSV
            </Button>
            <Button variant="outline" icon={Printer} onClick={() => window.print()} disabled={loading}>
              Print
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm print:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === key
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 print:hidden">
        {data && (
          <p className="text-xs text-slate-400">
            {data.length} record{data.length === 1 ? "" : "s"}
          </p>
        )}
        {tab === "accounts" && data && (
          <p className="text-xs font-medium text-slate-500">
            Total balance:{" "}
            <span className="tabular-nums font-semibold text-slate-800">
              {formatCurrency(totalBalance)}
            </span>
          </p>
        )}
      </div>

      <Card noPadding>
        <Table
          columns={config.columns}
          rows={(data || []).map((item, i) => ({
            ...item,
            key: item.id ?? item.account_number ?? i,
          }))}
          loading={loading}
          emptyTitle="No records yet"
          emptyDescription="This report is empty. Add some data first."
          rowKey="key"
        />
      </Card>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          Generating report...
        </div>
      )}
    </div>
  );
}
