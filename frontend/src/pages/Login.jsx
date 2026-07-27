import { useState, useEffect } from "react";
import {
  Eye, EyeOff, Building2, Shield, User, ArrowRight, Sparkles,
  CheckCircle, Lock, CreditCard, TrendingUp, Globe, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import toast from "react-hot-toast";

const FEATURES = [
  { icon: CreditCard, title: "Digital Banking Cards", desc: "Manage all your accounts with instant balance visibility" },
  { icon: TrendingUp, title: "Real-time Analytics", desc: "Live charts and financial growth tracking at a glance" },
  { icon: Lock, title: "Bank-Grade Security", desc: "256-bit SSL encryption with JWT authentication" },
  { icon: Globe, title: "Instant Transfers", desc: "Send money globally with zero processing delays" },
];

export default function Login() {
  const navigate = useNavigate();
  const { loginCustomer } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState("customer");
  const [staffData, setStaffData] = useState({ username: "", password: "" });
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [customerIdentifier, setCustomerIdentifier] = useState("");
  const [customerCredential, setCustomerCredential] = useState("");
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(f => (f + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setStaffLoading(true);
    setError("");
    try {
      const data = await loginUser(staffData);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user_role", "STAFF");
      toast.success("Welcome to Staff Portal!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    if (!customerIdentifier.trim()) { setError("Account Number or Email is required."); return; }
    setCustomerLoading(true);
    setError("");
    const res = await loginCustomer(customerIdentifier.trim(), customerCredential.trim());
    if (res.success) {
      toast.success(`Welcome, ${res.data.customer?.full_name || "Customer"}!`);
      navigate("/customer/dashboard");
    } else {
      setError(res.error);
    }
    setCustomerLoading(false);
  };

  const handleDemoCustomerLogin = async () => {
    setCustomerIdentifier("SB100000001");
    setCustomerCredential("123456");
    setCustomerLoading(true);
    setError("");
    const res = await loginCustomer("SB100000001", "123456");
    if (res.success) {
      toast.success("Demo Customer Login Successful!");
      navigate("/customer/dashboard");
    } else { setError(res.error); }
    setCustomerLoading(false);
  };

  const handleDemoStaffLogin = async () => {
    setStaffData({ username: "admin", password: "admin123" });
    setStaffLoading(true);
    setError("");
    try {
      const data = await loginUser({ username: "admin", password: "admin123" });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user_role", "STAFF");
      toast.success("Demo Staff Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Demo staff login failed.");
    } finally {
      setStaffLoading(false);
    }
  };

  const feat = FEATURES[currentFeature];
  const FeatIcon = feat.icon;

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(-45deg,#060d1a,#0f172a,#1e1b4b,#0a1628)", backgroundSize: "400% 400%", animation: "gradient-shift 12s ease infinite" }}>

      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-[0.10]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-xl tracking-tight">APEX BANK</p>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Financial Management</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="my-auto space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-indigo-300 text-xs font-semibold">Next-Generation Banking Platform</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                Banking,<br />
                <span style={{ background: "linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Reimagined.
                </span>
              </h1>
              <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-md">
                Complete banking management with real-time analytics, instant transfers, and enterprise-grade security — all in one platform.
              </p>
            </div>

            {/* Animated Feature Rotator */}
            <div className="relative h-28 overflow-hidden">
              <div key={currentFeature} className="fade-up flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <FeatIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{feat.title}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
              {/* Dots */}
              <div className="flex gap-1.5 mt-4 justify-center">
                {FEATURES.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentFeature ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20"}`} />
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "99.9%", label: "Uptime SLA" },
                { val: "256-bit", label: "SSL Encrypted" },
                { val: "< 1s", label: "Transfer Speed" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center bg-white/5 rounded-xl p-3 border border-white/8">
                  <p className="text-white font-black text-lg">{val}</p>
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-xs">© 2026 Apex Bank Systems · All rights reserved</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] scale-in">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-white font-black text-lg">APEX BANK</span>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderRadius: "24px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)" }}>

            {/* Tab Switcher */}
            <div className="p-6 pb-0">
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl" style={{ background: "#f1f5f9" }}>
                {[
                  { key: "customer", label: "Customer Portal", icon: User },
                  { key: "staff", label: "Staff Portal", icon: Shield },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setActiveTab(key); setError(""); }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all"
                    style={activeTab === key ? {
                      background: "#fff",
                      color: "#4f46e5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                    } : { color: "#64748b" }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {activeTab === "customer" ? "Online Banking" : "Staff Administration"}
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  {activeTab === "customer"
                    ? "Sign in with your account number or registered email"
                    : "Authorized personnel only — restricted access"}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl fade-in">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}

              {/* ── CUSTOMER FORM ── */}
              {activeTab === "customer" ? (
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Account Number or Email
                    </label>
                    <input
                      type="text"
                      value={customerIdentifier}
                      onChange={e => setCustomerIdentifier(e.target.value)}
                      placeholder="e.g. SB100000001 or name@email.com"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Phone Number / Access PIN
                    </label>
                    <input
                      type="password"
                      value={customerCredential}
                      onChange={e => setCustomerCredential(e.target.value)}
                      placeholder="Your registered phone or PIN (e.g. 123456)"
                      className="input-field"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={customerLoading}
                    className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 4px 14px rgba(79,70,229,0.4)" }}
                  >
                    {customerLoading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</span>
                    ) : (<>Access Account Dashboard <ArrowRight size={15} /></>)}
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoCustomerLogin}
                    className="w-full py-2.5 text-xs font-bold text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition flex items-center justify-center gap-1.5"
                    style={{ background: "#eef2ff" }}
                  >
                    <Sparkles size={13} className="text-amber-500" />
                    Quick Demo Login (SB100000001)
                  </button>
                </form>
              ) : (
                /* ── STAFF FORM ── */
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Staff Username
                    </label>
                    <input
                      type="text"
                      value={staffData.username}
                      onChange={e => setStaffData(p => ({ ...p, username: e.target.value }))}
                      placeholder="e.g. admin"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? "text" : "password"}
                        value={staffData.password}
                        onChange={e => setStaffData(p => ({ ...p, password: e.target.value }))}
                        placeholder="Enter staff password"
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showStaffPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={staffLoading}
                    className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 4px 14px rgba(79,70,229,0.4)" }}
                  >
                    {staffLoading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</span>
                    ) : (<>Sign In to Staff Portal <ArrowRight size={15} /></>)}
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoStaffLogin}
                    className="w-full py-2.5 text-xs font-bold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                    style={{ background: "#f8fafc" }}
                  >
                    <Shield size={13} className="text-indigo-500" />
                    Quick Demo Staff Login (Admin)
                  </button>
                </form>
              )}

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100">
                {[
                  { icon: CheckCircle, label: "Secure Login" },
                  { icon: Lock, label: "256-bit SSL" },
                  { icon: Zap, label: "Instant Access" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Icon size={11} className="text-emerald-500" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}