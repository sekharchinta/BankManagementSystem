import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const menu = [
  { name: "Dashboard",    icon: LayoutDashboard, path: "/dashboard" },
  { name: "Customers",    icon: Users,            path: "/customers" },
  { name: "Accounts",     icon: Landmark,         path: "/accounts" },
  { name: "Deposit",      icon: ArrowDownCircle,  path: "/deposit" },
  { name: "Withdraw",     icon: ArrowUpCircle,    path: "/withdraw" },
  { name: "Transfer",     icon: ArrowLeftRight,   path: "/transfer" },
  { name: "Transactions", icon: BarChart3,        path: "/transactions" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out`}
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 slide-in">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm leading-tight">BankPro</h2>
              <p className="text-xs text-indigo-300">Management</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all group relative ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
                  : {}
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all group"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={18} className="shrink-0 group-hover:text-red-400 transition-colors" />
          {!collapsed && (
            <span className="text-sm font-medium group-hover:text-red-300">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}