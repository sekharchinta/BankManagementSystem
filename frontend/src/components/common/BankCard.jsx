import { useState } from "react";
import { Eye, EyeOff, CreditCard, Wifi, ShieldCheck, Sparkles } from "lucide-react";

export default function BankCard({ account, customerName, theme = "indigo" }) {
  const [showBalance, setShowBalance] = useState(true);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const accountNumber = account?.account_number || "SB100000001";
  const balance = account?.balance !== undefined ? account.balance : 0.00;
  const accountType = account?.account_type || "Savings";

  // Format account number like a credit card: SB10 0000 0001
  const formattedCardNum = accountNumber.replace(/(.{4})/g, "$1 ").trim();
  const maskedCardNum = showCardNumber 
    ? formattedCardNum 
    : `•••• •••• ${accountNumber.slice(-4)}`;

  const themes = {
    indigo: "from-indigo-600 via-purple-600 to-slate-900 shadow-indigo-500/25",
    emerald: "from-emerald-600 via-teal-700 to-slate-900 shadow-emerald-500/25",
    dark: "from-slate-800 via-slate-900 to-black shadow-slate-900/50 border border-slate-700/50",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${themes[theme] || themes.indigo} p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-wider text-sm uppercase opacity-90">
            APEX BANK DIGITAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="h-5 w-5 rotate-90 text-white/80" />
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            {accountType}
          </span>
        </div>
      </div>

      {/* Chip & Balance Switch */}
      <div className="my-6 flex items-center justify-between">
        {/* EMV Chip graphic */}
        <div className="relative h-9 w-12 rounded-md bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 p-1 shadow-inner">
          <div className="h-full w-full rounded border border-amber-600/40 opacity-75" />
        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/25"
        >
          {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span>{showBalance ? "Hide Balance" : "Show Balance"}</span>
        </button>
      </div>

      {/* Account Number */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase font-medium tracking-wider text-white/70">
            Account / Card Number
          </p>
          <button
            onClick={() => setShowCardNumber(!showCardNumber)}
            className="text-[11px] text-white/70 hover:text-white underline"
          >
            {showCardNumber ? "Mask" : "Reveal"}
          </button>
        </div>
        <p className="font-mono text-xl font-semibold tracking-widest text-white drop-shadow-sm mt-1">
          {maskedCardNum}
        </p>
      </div>

      {/* Card Details & Balance */}
      <div className="flex items-end justify-between border-t border-white/15 pt-4">
        <div>
          <p className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
            Cardholder Name
          </p>
          <p className="font-semibold tracking-wide text-sm text-white capitalize">
            {customerName || "Valued Customer"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
            Available Balance
          </p>
          <p className="font-mono text-xl font-bold tracking-tight text-emerald-300">
            {showBalance ? `$${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••••"}
          </p>
        </div>
      </div>
    </div>
  );
}
