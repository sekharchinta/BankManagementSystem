import { useState } from "react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowLeftRight,
  ReceiptText,
  User,
  Menu,
  LogOut,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials, formatAccountNumber } from "../../lib/format";
import Logo from "../ui/Logo";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/customer" },
  { name: "Deposit", icon: ArrowDownCircle, path: "/customer/deposit" },
  { name: "Transfer", icon: ArrowLeftRight, path: "/customer/transfer" },
  { name: "Transactions", icon: ReceiptText, path: "/customer/transactions" },
  { name: "Profile", icon: User, path: "/customer/profile" },
];

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { customer, activeAccount, accounts, switchAccount, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const displayName = customer?.full_name || "Customer";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <Logo size="sm" />
          <div>
            <p className="text-sm font-bold tracking-tight text-white">ApexBank</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Online Banking
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-brand-600/15 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
                    )}
                    <Icon
                      size={17}
                      className={isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} ApexBank Systems
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64 print:pl-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 print:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Welcome, {displayName.split(" ")[0]}
              </p>
              <p className="hidden text-xs text-slate-400 sm:block">
                {activeAccount
                  ? `${formatAccountNumber(activeAccount.account_number)} · ${activeAccount.account_type}`
                  : "Online Banking"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {accounts.length > 1 && (
              <select
                value={activeAccount?.account_number || ""}
                onChange={(e) => switchAccount(e.target.value)}
                className="hidden h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none sm:block"
              >
                {accounts.map((account) => (
                  <option key={account.account_number} value={account.account_number}>
                    {account.account_number} ({account.account_type})
                  </option>
                ))}
              </select>
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {initials(displayName)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
