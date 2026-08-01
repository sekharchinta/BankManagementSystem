import { useEffect, useState } from "react";
import { Eye, EyeOff, Shield, User, UserPlus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";
import { APP_NAME } from "../lib/constants";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import { Field, Input, Select } from "../components/ui/Field";
import Logo from "../components/ui/Logo";

const TABS = [
  { key: "customer", label: "Customer", icon: User, description: "Online banking access" },
  { key: "staff", label: "Staff", icon: Shield, description: "Secure admin console" },
  { key: "register", label: "Register", icon: UserPlus, description: "Open a new account" },
];

const EMPTY_REGISTER = {
  full_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  address: "",
  account_type: "Savings",
  password: "",
  confirm_password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const { role, loginStaff, loginCustomer, registerCustomer } = useAuth();

  const [tab, setTab] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [credential, setCredential] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  useEffect(() => {
    if (role === "STAFF") navigate("/dashboard", { replace: true });
    else if (role === "CUSTOMER") navigate("/customer", { replace: true });
  }, [role, navigate]);

  const handleCustomer = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your account number or registered email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await loginCustomer(identifier.trim(), credential.trim());
      toast.success(`Welcome, ${data.customer?.full_name || "Customer"}!`);
      navigate("/customer", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  const handleStaff = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginStaff({ username, password });
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid username or password."));
    } finally {
      setLoading(false);
    }
  };

  const setRegister = (key) => (e) => {
    const value = e.target.value;
    setRegisterForm((f) => ({ ...f, [key]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const f = registerForm;
    if (!f.full_name.trim() || !f.email.trim() || !f.phone.trim() || !f.address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (f.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (f.password !== f.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerCustomer({
        full_name: f.full_name.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        date_of_birth: f.date_of_birth || null,
        address: f.address.trim(),
        account_type: f.account_type,
        password: f.password,
      });
      toast.success(
        `Account opened, ${data.customer?.full_name || ""}! Your account number is ${
          data.primary_account?.account_number || data.accounts?.[0]?.account_number || ""
        }.`
      );
      navigate("/customer", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-sky-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-slate-400">Bank Management System</p>
        </div>

        <div className="animate-slide-up overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          {/* Tab switcher */}
          <div className="grid grid-cols-3 gap-1 p-2">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key);
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  tab === key
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "customer" ? (
              <form onSubmit={handleCustomer} className="space-y-4">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Building2 size={14} />
                  <span className="text-xs">Sign in to your banking account</span>
                </div>

                <Field label="Account number or email" required>
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. SB100000001 or name@email.com"
                    autoComplete="username"
                  />
                </Field>

                <Field
                  label="Password"
                  hint='Your password, or your registered phone/email for older accounts'
                >
                  <Input
                    type="password"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </Field>

                {error && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Access Account
                </Button>
              </form>
            ) : tab === "staff" ? (
              <form onSubmit={handleStaff} className="space-y-4">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Shield size={14} />
                  <span className="text-xs">Restricted — authorized personnel only</span>
                </div>

                <Field label="Username" required>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    autoComplete="username"
                  />
                </Field>

                <Field label="Password" required>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                {error && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Sign in to Staff Portal
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <UserPlus size={14} />
                  <span className="text-xs">Open a new savings or current account</span>
                </div>

                <Field label="Full name" required>
                  <Input
                    type="text"
                    value={registerForm.full_name}
                    onChange={setRegister("full_name")}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" required>
                    <Input
                      type="email"
                      value={registerForm.email}
                      onChange={setRegister("email")}
                      placeholder="name@email.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <Input
                      type="tel"
                      value={registerForm.phone}
                      onChange={setRegister("phone")}
                      placeholder="e.g. 9876543210"
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date of birth">
                    <Input
                      type="date"
                      value={registerForm.date_of_birth}
                      onChange={setRegister("date_of_birth")}
                    />
                  </Field>
                  <Field label="Account type" required>
                    <Select
                      value={registerForm.account_type}
                      onChange={setRegister("account_type")}
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </Select>
                  </Field>
                </div>

                <Field label="Address" required>
                  <Input
                    type="text"
                    value={registerForm.address}
                    onChange={setRegister("address")}
                    placeholder="Street, city, state"
                    autoComplete="street-address"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Password" required hint="Minimum 8 characters">
                    <div className="relative">
                      <Input
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={setRegister("password")}
                        placeholder="Create a password"
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle password visibility"
                      >
                        {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm password" required>
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerForm.confirm_password}
                      onChange={setRegister("confirm_password")}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </Field>
                </div>

                {error && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Create Account
                </Button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
              <span>Secure JWT authentication</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
