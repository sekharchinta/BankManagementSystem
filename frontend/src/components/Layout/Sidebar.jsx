import {
  LayoutDashboard,
  Users,
  KeyRound,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  ReceiptText,
  FileBarChart2,
  UserCog,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Customers", icon: Users, path: "/customers" },
      { name: "Accounts", icon: Landmark, path: "/accounts" },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Deposit", icon: ArrowDownCircle, path: "/deposit" },
      { name: "Withdraw", icon: ArrowUpCircle, path: "/withdraw" },
      { name: "Transfer", icon: ArrowLeftRight, path: "/transfer" },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Transactions", icon: ReceiptText, path: "/transactions" },
      { name: "Reports", icon: FileBarChart2, path: "/reports" },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Users", icon: KeyRound, path: "/users" },
      { name: "Profile", icon: UserCog, path: "/profile" },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <Logo size="sm" />
          <div>
            <p className="text-sm font-bold tracking-tight text-white">ApexBank</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Management
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
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
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} ApexBank Systems
          </p>
        </div>
      </aside>
    </>
  );
}
