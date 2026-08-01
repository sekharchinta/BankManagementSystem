import { useMemo } from "react";
import {
  Users,
  Landmark,
  ReceiptText,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { useAsync } from "../../hooks/useAsync";
import { getSummary, getRecentTransactions } from "../../services/dashboard";
import { reportAccounts, reportTransactions } from "../../services/reports";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatNumber,
  toNumber,
} from "../../lib/format";
import { Bar, Doughnut, gridOptions, CHART_COLORS } from "../../lib/charts";
import { TransactionBadge, AmountCell, normalizeType } from "../../components/shared/TransactionBadge";

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function buildDailyTrend(transactions) {
  const days = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    days.push({ key: dayKey(date), label, count: 0 });
  }
  const map = new Map(days.map((d) => [d.key, d]));
  transactions.forEach((t) => {
    const k = dayKey(t.created_at);
    const entry = map.get(k);
    if (entry) entry.count += 1;
  });
  return days;
}

function buildTypeMix(transactions) {
  const counts = { Deposit: 0, Withdraw: 0, Transfer: 0 };
  transactions.forEach((t) => {
    const type = normalizeType(t.transaction_type);
    if (counts[type] !== undefined) counts[type] += 1;
  });
  return counts;
}

export default function Dashboard() {
  const summary = useAsync(() => getSummary(), []);
  const recent = useAsync(() => getRecentTransactions(), []);
  const accountsReport = useAsync(() => reportAccounts(), []);
  const txReport = useAsync(() => reportTransactions(), []);

  const s = summary.data || {};

  const accountTypes = useMemo(() => {
    const list = accountsReport.data || [];
    const groups = {};
    list.forEach((account) => {
      const type = account.account_type || "Other";
      groups[type] = groups[type] || { count: 0, balance: 0 };
      groups[type].count += 1;
      groups[type].balance += toNumber(account.balance);
    });
    return Object.entries(groups).map(([name, value]) => ({ name, ...value }));
  }, [accountsReport.data]);

  const dailyTrend = useMemo(() => buildDailyTrend(txReport.data || []), [txReport.data]);
  const typeMix = useMemo(() => buildTypeMix(txReport.data || []), [txReport.data]);
  const totalTxCount = (txReport.data || []).length;

  const trendChartData = {
    labels: dailyTrend.map((d) => d.label),
    datasets: [
      {
        label: "Transactions",
        data: dailyTrend.map((d) => d.count),
        backgroundColor: CHART_COLORS.indigo,
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  };

  const mixChartData = {
    labels: ["Deposits", "Withdrawals", "Transfers"],
    datasets: [
      {
        data: [typeMix.Deposit, typeMix.Withdraw, typeMix.Transfer],
        backgroundColor: [CHART_COLORS.emerald, CHART_COLORS.rose, CHART_COLORS.indigo],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const recentRows = (recent.data || []).map((tx) => ({
    key: tx.id,
    type: <TransactionBadge type={tx.transaction_type} />,
    account: tx.account_number,
    amount: <AmountCell transaction={tx} />,
    balance: formatCurrency(tx.balance_after_transaction),
    description: tx.description || "—",
    date: formatDate(tx.created_at, { withTime: true }),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your bank's key metrics"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Customers"
          value={formatNumber(s.customers)}
          icon={Users}
          accent="indigo"
          loading={summary.loading}
          footer="Registered customers"
        />
        <StatCard
          label="Total Accounts"
          value={formatNumber(s.accounts)}
          icon={Landmark}
          accent="sky"
          loading={summary.loading}
          footer="Savings & current"
        />
        <StatCard
          label="Transactions"
          value={formatNumber(s.transactions)}
          icon={ReceiptText}
          accent="violet"
          loading={summary.loading}
          footer="All time volume"
        />
        <StatCard
          label="Total Deposits"
          value={formatCurrencyCompact(s.total_balance)}
          icon={Wallet}
          accent="emerald"
          loading={summary.loading}
          footer="Across all accounts"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Transaction Activity" subtitle="Transactions per day · last 14 days" className="lg:col-span-2">
          <div className="h-72">
            {txReport.loading ? (
              <div className="flex h-full items-center justify-center">
                <span className="skeleton h-full w-full" />
              </div>
            ) : (
              <Bar data={trendChartData} options={{ ...gridOptions, plugins: { ...gridOptions.plugins, legend: { display: false } } }} />
            )}
          </div>
        </Card>

        <Card title="Transaction Mix" subtitle={`${formatNumber(totalTxCount)} transactions recorded`}>
          <div className="h-72">
            {txReport.loading ? (
              <div className="flex h-full items-center justify-center">
                <span className="skeleton h-64 w-64 rounded-full" />
              </div>
            ) : (
              <Doughnut data={mixChartData} options={gridOptions} />
            )}
          </div>
        </Card>
      </div>

      {/* Account type split + recent transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Balance by Account Type" subtitle="Distribution of total deposits">
          <div className="space-y-6 py-2">
            {accountsReport.loading ? (
              <>
                <span className="skeleton block h-16 w-full" />
                <span className="skeleton block h-16 w-full" />
              </>
            ) : accountTypes.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No accounts yet</p>
            ) : (
              accountTypes.map((type) => {
                const pct = totalTxCount > 0 ? (type.count / accountTypes.reduce((a, t) => a + t.count, 0)) * 100 : 0;
                const balancePct =
                  toNumber(s.total_balance) > 0
                    ? (type.balance / toNumber(s.total_balance)) * 100
                    : 0;
                return (
                  <div key={type.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">{type.name}</p>
                      <p className="tabular-nums text-sm font-semibold text-slate-900">
                        {formatCurrency(type.balance)}
                      </p>
                    </div>
                    <div className="mb-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                        style={{ width: `${Math.max(2, balancePct)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {type.count} account{type.count === 1 ? "" : "s"} · {pct.toFixed(1)}% of total
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card
          title="Recent Transactions"
          subtitle="Latest 10 activity entries"
          className="lg:col-span-2"
          noPadding
          actions={
            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight size={13} />
            </Link>
          }
        >
          <Table
            columns={[
              { key: "type", header: "Type", render: (r) => r.type },
              { key: "account", header: "Account", render: (r) => (
                <span className="font-mono text-xs">{r.account}</span>
              )},
              { key: "amount", header: "Amount", align: "right", render: (r) => r.amount },
              { key: "balance", header: "Balance", align: "right", render: (r) => (
                <span className="tabular-nums text-slate-500">{r.balance}</span>
              )},
              { key: "date", header: "Date", render: (r) => (
                <span className="text-slate-500">{r.date}</span>
              )},
            ]}
            rows={recentRows}
            loading={recent.loading}
            emptyTitle="No transactions yet"
          />
        </Card>
      </div>
    </div>
  );
}
