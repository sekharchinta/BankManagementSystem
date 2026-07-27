import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useTheme } from "../../context/ThemeContext";
import { 
  LayoutDashboard, 
  Send, 
  PlusCircle, 
  History, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Building2, 
  CreditCard,
  ChevronDown,
  Bell
} from "lucide-react";

export default function CustomerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, activeAccount, setActiveAccount, accounts, logoutCustomer } = useCustomerAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const handleLogout = () => {
    logoutCustomer();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { label: "Transfer Money", path: "/customer/transfer", icon: Send },
    { label: "Add Funds", path: "/customer/deposit", icon: PlusCircle },
    { label: "History", path: "/customer/transactions", icon: History },
    { label: "My Profile", path: "/customer/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Customer Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link to="/customer/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  APEX BANK
                </span>
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Customer Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Account Selector & Balance Pill */}
          {activeAccount && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-100/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <CreditCard className="h-4 w-4 text-indigo-500" />
                <span>{activeAccount.account_number} ({activeAccount.account_type})</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ${Number(activeAccount.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showAccountDropdown && accounts.length > 1 && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Account
                  </p>
                  {accounts.map((acc) => (
                    <button
                      key={acc.account_number}
                      onClick={() => {
                        setActiveAccount(acc);
                        setShowAccountDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                        acc.account_number === activeAccount.account_number
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{acc.account_number}</span>
                      <span className="font-mono font-bold">${Number(acc.balance).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Header Options */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {/* Customer User Profile Badge */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-md">
                {customer?.full_name ? customer.full_name.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-tight capitalize text-slate-800 dark:text-slate-200">
                  {customer?.full_name || "Customer"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {activeAccount?.account_number || "SB100000001"}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Tabs Bar */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold transition ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 fade-in">
        {children}
      </main>
    </div>
  );
}
