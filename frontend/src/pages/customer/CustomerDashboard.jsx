import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowLeftRight,
  ReceiptText,
  Wallet,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import HiddenBalance from "../../components/ui/HiddenBalance";
import { TransactionBadge, AmountCell } from "../../components/shared/TransactionBadge";
import { useAuth } from "../../context/AuthContext";
import { customerTransactions } from "../../services/customers";
import { getErrorMessage } from "../../lib/api";
import { formatAccountNumber, formatDateTime } from "../../lib/format";

const QUICK_ACTIONS = [
  {
    name: "Deposit Money",
    description: "Add funds to your account",
    icon: ArrowDownCircle,
    to: "/customer/deposit",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Send Money",
    description: "Transfer to another account",
    icon: ArrowLeftRight,
    to: "/customer/transfer",
    accent: "bg-brand-50 text-brand-600",
  },
  {
    name: "View History",
    description: "All your transactions",
    icon: ReceiptText,
    to: "/customer/transactions",
    accent: "bg-violet-50 text-violet-600",
  },
];

export default function CustomerDashboard() {
  const { customer, accounts, activeAccount, refreshCustomer } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshCustomer().catch(() => {});
  }, [refreshCustomer]);

  const loadTransactions = useCallback(async () => {
    if (!activeAccount?.account_number) return;
    setLoading(true);
    try {
      const data = await customerTransactions(activeAccount.account_number);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load transactions."));
    } finally {
      setLoading(false);
    }
  }, [activeAccount?.account_number]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const recentRows = transactions.slice(0, 8).map((tx) => ({
    key: tx.id,
    type: <TransactionBadge type={tx.transaction_type} />,
    amount: <AmountCell transaction={tx} />,
    date: formatDateTime(tx.created_at),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Good day, {customer?.full_name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{today}</p>
      </div>

      {/* Balance card + accounts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main account card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl lg:col-span-2">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-600/25 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Total Balance
              </p>
              <HiddenBalance
                value={activeAccount?.balance}
                className="mt-2 text-4xl font-bold tracking-tight"
                iconSize={20}
              />
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Wallet size={20} />
            </div>
          </div>

          <div className="relative z-10 mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-400">Account holder</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {customer?.full_name || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Account number</p>
              <p className="font-mono mt-0.5 text-sm font-semibold tracking-wider text-white">
                {formatAccountNumber(activeAccount?.account_number)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Account type</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {activeAccount?.account_type || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Other accounts */}
        <Card noPadding>
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Your Accounts</h3>
          </header>
          <div className="divide-y divide-slate-100">
            {accounts.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-slate-400">No accounts found</p>
            )}
            {accounts.map((account) => {
              const isActive = account.account_number === activeAccount?.account_number;
              return (
                <div
                  key={account.account_number}
                  className={`flex items-center justify-between px-5 py-4 ${
                    isActive ? "bg-brand-50/60" : ""
                  }`}
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-slate-900">
                      {account.account_number}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                      <Building2 size={11} />
                      {account.account_type}
                      {isActive && (
                        <span className="ml-1 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                          Current
                        </span>
                      )}
                    </p>
                  </div>
                  <HiddenBalance
                    value={account.balance}
                    className="text-sm font-bold text-slate-900"
                    iconSize={13}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map(({ name, description, icon: Icon, to, accent }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                {name}
              </p>
              <p className="truncate text-xs text-slate-400">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent transactions */}
      <Card
        title="Recent Activity"
        subtitle={`Latest transactions for ${formatAccountNumber(activeAccount?.account_number)}`}
        noPadding
        actions={
          <Link
            to="/customer/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <TrendingUp size={13} /> View all
          </Link>
        }
      >
        <Table
          columns={[
            { key: "type", header: "Type", render: (r) => r.type },
            {
              key: "amount",
              header: "Amount",
              align: "right",
              render: (r) => r.amount,
            },
            {
              key: "date",
              header: "Date",
              render: (r) => <span className="text-slate-500">{r.date}</span>,
            },
          ]}
          rows={recentRows}
          loading={loading}
          emptyTitle="No transactions yet"
          emptyDescription="Your recent transactions will appear here."
        />
      </Card>
    </div>
  );
}
