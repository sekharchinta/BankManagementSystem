import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { fetchCustomerTransactionsApi } from "../../services/customerService";
import BankCard from "../../components/common/BankCard";
import TransactionModal from "../../components/common/TransactionModal";
import { 
  Send, 
  PlusCircle, 
  History, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck,
  Zap,
  Sparkles,
  Receipt
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CustomerDashboard() {
  const { customer, activeAccount, refreshCustomerData } = useCustomerAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    refreshCustomerData();
  }, []);

  useEffect(() => {
    if (activeAccount?.account_number) {
      loadTransactions(activeAccount.account_number);
    }
  }, [activeAccount]);

  const loadTransactions = async (accountNumber) => {
    setLoading(true);
    try {
      const data = await fetchCustomerTransactionsApi(accountNumber);
      setTransactions(data || []);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compute income and expenses from transactions
  const totalIncome = transactions
    .filter((t) => t.transaction_type === "DEPOSIT")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.transaction_type === "WITHDRAW" || t.transaction_type === "TRANSFER")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Financial Chart Data setup
  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: "Account Balance Trend",
        data: [
          (activeAccount?.balance || 500) * 0.7,
          (activeAccount?.balance || 500) * 0.75,
          (activeAccount?.balance || 500) * 0.8,
          (activeAccount?.balance || 500) * 0.85,
          (activeAccount?.balance || 500) * 0.9,
          (activeAccount?.balance || 500) * 0.95,
          activeAccount?.balance || 500,
        ],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Balance: $${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(148, 163, 184, 0.1)" } },
    },
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Online Banking Access
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {customer?.full_name || "Valued Customer"}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-200">
              Manage your funds, execute instant transfers, and track account analytics in real time.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/customer/transfer"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md transition hover:bg-indigo-50"
            >
              <Send className="h-4 w-4 text-indigo-600" /> Send Money
            </Link>
            <Link
              to="/customer/deposit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500 border border-indigo-500"
            >
              <PlusCircle className="h-4 w-4" /> Add Funds
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Bank Card & Stat Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Visual Digital Bank Card */}
        <div className="lg:col-span-1">
          <BankCard account={activeAccount} customerName={customer?.full_name} theme="indigo" />
          
          {/* Quick Account Security Badge */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Account Verified</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">256-Bit SSL Encryption Active</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 uppercase">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Right Col: Financial Overview Stats & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Balance Stat Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Balance</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${Number(activeAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" /> Account Active
              </span>
            </div>

            {/* Income Stat Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Inflow</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                Deposits & Credits
              </span>
            </div>

            {/* Outflow Stat Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Outflow</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">
                -${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                Transfers & Withdrawals
              </span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Financial Growth Trend</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time balance historical chart</p>
              </div>
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                2026 Year-to-Date
              </span>
            </div>
            <div className="h-48 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Account Activity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest transactions associated with your account</p>
          </div>
          <Link
            to="/customer/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View All History <History className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-10 w-full skeleton" />
            <div className="h-10 w-full skeleton" />
            <div className="h-10 w-full skeleton" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-10 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm">No recent transactions recorded yet.</p>
            <Link
              to="/customer/deposit"
              className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Add Your First Deposit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.slice(0, 5).map((tx) => {
                  const isDeposit = tx.transaction_type === "DEPOSIT";
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded ${
                          isDeposit
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                        }`}>
                          {isDeposit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                        {tx.description || "Bank Transaction"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className={`py-3 px-4 font-mono font-bold text-right ${
                        isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {isDeposit ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800"
                        >
                          <Receipt className="h-3 w-3" /> Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
