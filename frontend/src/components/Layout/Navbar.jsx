import { Bell, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const PAGE_TITLES = {
  "/dashboard":    { title: "Staff Dashboard", subtitle: "Overview of bank metrics, customers, and operations." },
  "/customers":    { title: "Customers Directory", subtitle: "Manage customer profiles and accounts." },
  "/accounts":     { title: "Bank Accounts", subtitle: "View and manage accounts ledger." },
  "/deposit":      { title: "Deposit Funds", subtitle: "Deposit money into customer accounts." },
  "/withdraw":     { title: "Withdraw Funds", subtitle: "Process customer cash withdrawals." },
  "/transfer":     { title: "Money Transfer", subtitle: "Transfer funds between bank accounts." },
  "/transactions": { title: "Transaction History", subtitle: "Browse system-wide transaction logs." },
};

export default function Navbar() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const info = PAGE_TITLES[location.pathname] || { title: "Apex Bank Management", subtitle: "" };

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-100">

      {/* Left — page title */}
      <div>
        <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{info.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">{info.subtitle}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Date chip */}
        <span className="hidden lg:block text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-xl whitespace-nowrap">
          {date}
        </span>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
               style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Bank Staff Admin</p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Authorized</p>
          </div>
        </div>

      </div>
    </header>
  );
}