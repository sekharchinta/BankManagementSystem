import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  Send, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Receipt,
  Sparkles
} from "lucide-react";
import DashboardCard from "../components/common/DashboardCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TransactionModal from "../components/common/TransactionModal";
import { getDashboardSummary, getRecentTransactions } from "../services/dashboardService";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError(null);
      const summaryData = await getDashboardSummary();
      const recentData = await getRecentTransactions();
      setSummary(summaryData);
      setTransactions(recentData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load staff dashboard analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Staff Dashboard Analytics..." />;

  // Chart 1: Line Chart Data
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        fill: true,
        label: "Transaction Volume ($)",
        data: [12000, 19000, 15000, 28000, 22000, 34000, summary?.total_balance ? summary.total_balance * 0.1 : 45000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        tension: 0.4,
      },
    ],
  };

  // Chart 2: Account Types Doughnut
  const doughnutData = {
    labels: ["Savings Accounts", "Current Accounts"],
    datasets: [
      {
        data: [
          Math.ceil((summary?.accounts || 5) * 0.6),
          Math.floor((summary?.accounts || 5) * 0.4),
        ],
        backgroundColor: ["#6366f1", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Banking Control Center
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">System Staff Overview</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time ledger analytics, accounts performance, and customer transaction auditing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/deposit"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
          >
            <ArrowDownCircle className="h-4 w-4" /> Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-amber-500 transition"
          >
            <ArrowUpCircle className="h-4 w-4" /> Withdraw
          </Link>
          <Link
            to="/transfer"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            <Send className="h-4 w-4" /> Transfer
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Customers"
          value={summary?.customers || 0}
          icon={Users}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50 dark:bg-indigo-950/60"
          trend={12.5}
          trendLabel="+12.5% new accounts"
        />
        <DashboardCard
          title="Total Accounts"
          value={summary?.accounts || 0}
          icon={CreditCard}
          color="text-purple-600 dark:text-purple-400"
          bg="bg-purple-50 dark:bg-purple-950/60"
          trend={8.2}
          trendLabel="Active ledger accounts"
        />
        <DashboardCard
          title="Total Bank Deposits"
          value={`$${Number(summary?.total_balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
          trend={15.4}
          trendLabel="Overall liquidity"
        />
        <DashboardCard
          title="Total Transactions"
          value={summary?.transactions || 0}
          icon={Activity}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-950/60"
          trend={6.8}
          trendLabel="Total processed"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Transaction Volume Trends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Weekly cashflow volume monitor</p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              Live Feed
            </span>
          </div>
          <div className="h-56 w-full">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Accounts Ratio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Savings vs Current accounts distribution</p>
          </div>
          <div className="h-44 w-full flex items-center justify-center my-2">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex justify-around text-xs font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Savings</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Current</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Live Transaction Stream</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest transactions across all customer accounts</p>
          </div>
          <Link to="/transactions" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Logs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.slice(0, 8).map((tx, idx) => {
                const isDeposit = tx.transaction_type === "DEPOSIT";
                return (
                  <tr key={tx.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tx.account_number || tx.account || "SB100000001"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        isDeposit ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      }`}>
                        {isDeposit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {tx.description || "System Transaction"}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(tx.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-4 font-mono font-bold text-right ${
                      isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}>
                      {isDeposit ? "+" : "-"}${Number(tx.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800"
                      >
                        <Receipt className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}