import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  User,
  UserPlus,
  Building2,
  Landmark,
  Users,
  Clock,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  PhoneCall,
  Lock,
  Star,
  Sparkles,
  TrendingUp,
  Wallet,
  CreditCard,
  HandCoins,
  PiggyBank,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Mail,
  Globe,
  Send,
  MessageCircle,
  AtSign,
} from "lucide-react";
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

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Insurance", href: "#insurance" },
  { label: "About", href: "#about" },
];

const BANK_STATS = [
  { icon: Landmark, value: "₹1,250 Cr+", label: "Total deposits" },
  { icon: Users, value: "50 Lakh+", label: "Happy customers" },
  { icon: MapPin, value: "2,400+", label: "Branches nationwide" },
  { icon: Clock, value: "24/7", label: "Digital banking" },
];

const SERVICES = [
  {
    icon: PiggyBank,
    title: "Savings Accounts",
    text: "Earn up to 6.5% p.a. on your savings with zero balance options and free online transfers.",
  },
  {
    icon: Building2,
    title: "Current Accounts",
    text: "Tailored accounts for businesses with unlimited transactions and dedicated relationship managers.",
  },
  {
    icon: TrendingUp,
    title: "Fixed Deposits",
    text: "Lock in guaranteed returns of up to 8% p.a. with flexible tenures starting from just 7 days.",
  },
  {
    icon: HandCoins,
    title: "Personal Loans",
    text: "Instant approvals up to ₹50 Lakh with minimal paperwork and interest from 9.9% p.a.",
  },
  {
    icon: CreditCard,
    title: "Credit Cards",
    text: "Lifetime-free cards with up to 5% cashback on spends and EMI conversion on the go.",
  },
  {
    icon: Wallet,
    title: "NRI Banking",
    text: "Global accounts for NRIs with priority remittance services and multi-currency support.",
  },
];

const INSURANCE_ADS = [
  {
    icon: HeartHandshake,
    tag: "Life Insurance",
    title: "LifeCover Plus",
    text: "Secure your family's future. Premiums start at ₹499/month with guaranteed payouts.",
    cta: "Explore plans",
  },
  {
    icon: ShieldCheck,
    tag: "Term Plan",
    title: "Apex Secure Life",
    text: "Up to ₹2 Cr life cover with returns up to 8% p.a. over 20 years.",
    cta: "Get a quote",
  },
  {
    icon: Users,
    tag: "Family Cover",
    title: "FamilyFirst Rider",
    text: "Zero-commission term plans with 24/7 claim assistance and fast settlement.",
    cta: "Protect your family",
  },
];

const REGISTER_STEPS = [
  {
    title: "Fill the quick form",
    text: "Tell us your name, contact details and choose your account type — it takes under 2 minutes.",
  },
  {
    title: "Get your account number",
    text: "Your account is opened instantly and your account number is generated right away.",
  },
  {
    title: "Start banking",
    text: "Log in to your dashboard to transfer funds, view statements and manage money 24/7.",
  },
];

const REGISTER_BENEFITS = [
  "Zero account maintenance fees for the first year",
  "Free debit card delivered to your doorstep",
  "Instant UPI, NEFT & RTGS transfers",
  "Personal relationship manager for every customer",
];

const TRUST_ITEMS = ["RBI-Regulated", "Insured deposits", "256-bit encrypted"];

export default function Login() {
  const navigate = useNavigate();
  const { role, loginStaff, loginCustomer, registerCustomer } = useAuth();

  const [tab, setTab] = useState("register");
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

  const scrollToAuth = (nextTab) => {
    setTab(nextTab);
    setError("");
    document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ============ Navbar ============ */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <Logo />
            <div className="leading-tight">
              <span className="block text-base font-bold tracking-tight">{APP_NAME}</span>
              <span className="block text-[11px] text-slate-400">Bank Management System</span>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              className="text-slate-200 hover:bg-white/10 hover:text-white"
              icon={User}
              onClick={() => scrollToAuth("customer")}
            >
              Login
            </Button>
            <Button icon={UserPlus} onClick={() => scrollToAuth("register")}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* ============ Hero ============ */}
      <section id="home" className="relative scroll-mt-16 overflow-hidden pt-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-600/20 blur-[120px]" />
          <div className="absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
              <Sparkles size={13} />
              India's most trusted digital bank
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Banking that works{" "}
              <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                as hard as you do
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              From everyday savings to long-term protection, {APP_NAME} brings modern, secure
              banking to your fingertips — with life insurance plans that keep your family covered.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" icon={UserPlus} onClick={() => scrollToAuth("register")}>
                Open an Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                icon={User}
                onClick={() => scrollToAuth("customer")}
              >
                Existing Customer? Login
              </Button>
            </div>
          </div>

          {/* Hero stats */}
          <div className="stagger mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
            {BANK_STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur"
              >
                <Icon size={20} className="mx-auto text-brand-400" />
                <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Services ============ */}
      <section id="services" className="scroll-mt-16 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Our services
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your money needs, in one place
            </h2>
            <p className="mt-3 text-slate-400">
              A complete suite of banking products built for individuals, families and
              businesses.
            </p>
          </div>

          <div className="stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-brand-500/40 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-600/25">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Insurance ============ */}
      <section id="insurance" className="scroll-mt-16 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-300">
              <HeartHandshake size={13} />
              Life insurance offers
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Protect the ones you love
            </h2>
            <p className="mt-3 text-slate-400">
              Exclusive life insurance plans for {APP_NAME} customers — affordable cover that
              pays out when it matters most.
            </p>
          </div>

          <div className="stagger mt-12 grid gap-5 lg:grid-cols-3">
            {INSURANCE_ADS.map(({ icon: Icon, tag, title, text, cta }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 to-violet-600/20 p-6 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-600/25">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-brand-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{text}</p>
                <a
                  href="#auth"
                  onClick={() => scrollToAuth("register")}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200"
                >
                  {cta}
                  <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ About / numbers band ============ */}
      <section id="about" className="scroll-mt-16 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-950 via-slate-900 to-violet-950 px-6 py-12 sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-600/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-600/25 blur-[90px]" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                  Why {APP_NAME}
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  A legacy of trust, built over 75 years
                </h2>
                <p className="mt-4 leading-relaxed text-slate-400">
                  {APP_NAME} has grown from a single branch in 1950 to one of India's most
                  trusted financial institutions. Today we combine that heritage with
                  cutting-edge digital banking — so you never have to choose between security
                  and convenience.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {TRUST_ITEMS.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                    >
                      <ShieldCheck size={14} className="text-emerald-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <TrendingUp size={20} className="text-brand-400" />
                  <p className="mt-2 text-3xl font-bold tabular-nums">₹1,250 Cr+</p>
                  <p className="mt-1 text-xs text-slate-400">Deposits</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <Users size={20} className="text-brand-400" />
                  <p className="mt-2 text-3xl font-bold tabular-nums">50 Lakh+</p>
                  <p className="mt-1 text-xs text-slate-400">Customers</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <MapPin size={20} className="text-brand-400" />
                  <p className="mt-2 text-3xl font-bold tabular-nums">2,400+</p>
                  <p className="mt-1 text-xs text-slate-400">Branches</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <Star size={20} className="text-brand-400" />
                  <p className="mt-2 text-3xl font-bold tabular-nums">4.8/5</p>
                  <p className="mt-1 text-xs text-slate-400">Customer rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Auth: register pitch + card ============ */}
      <section id="auth" className="scroll-mt-16 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Register pitch */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Get started
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Open your account in under{" "}
                <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                  2 minutes
                </span>
              </h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Join over 50 lakh customers banking with {APP_NAME}. No paperwork, no branch
                visits — just a few details and you're ready to go.
              </p>

              <div className="mt-8 space-y-5">
                {REGISTER_STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold shadow-lg shadow-brand-600/25">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-8 space-y-2.5">
                {REGISTER_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-400" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="mt-8"
                icon={UserPlus}
                onClick={() => scrollToAuth("register")}
              >
                Register Now — It's Free
              </Button>
            </div>

            {/* Login / Register card */}
            <div className="mx-auto w-full max-w-md lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
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
                        hint="Your password, or your registered phone/email for older accounts"
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

                      <p className="text-center text-xs text-slate-400">
                        New to {APP_NAME}?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setTab("register");
                            setError("");
                          }}
                          className="font-semibold text-brand-600 hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
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
                        <span className="text-xs">Open a new savings or current account — free</span>
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
                          <Select value={registerForm.account_type} onChange={setRegister("account_type")}>
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
                        Create My Account
                      </Button>

                      <p className="text-center text-xs text-slate-400">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setTab("customer");
                            setError("");
                          }}
                          className="font-semibold text-brand-600 hover:underline"
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock size={11} />
                      Secure JWT authentication
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-500" />
                      Rated 4.8/5 by customers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3">
                <Logo />
                <div className="leading-tight">
                  <span className="block text-base font-bold tracking-tight">{APP_NAME}</span>
                  <span className="block text-[11px] text-slate-400">Bank Management System</span>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Serving India since 1950 with modern, secure and honest banking — for
                individuals, families and businesses.
              </p>
              <div className="mt-5 flex gap-3">
                {[Globe, Send, MessageCircle, AtSign].map((Icon, i) => (
                  <a
                    key={i}
                    href="#home"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-brand-500/40 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Quick links
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="transition-colors hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#auth" onClick={() => scrollToAuth("register")} className="transition-colors hover:text-white">
                    Open an account
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Products
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>Savings & Current Accounts</li>
                <li>Fixed Deposits</li>
                <li>Personal Loans</li>
                <li>Credit Cards</li>
                <li>Life Insurance</li>
                <li>NRI Banking</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Contact
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2.5">
                  <PhoneCall size={15} className="text-brand-400" />
                  1800-120-2026 (Toll free, 24/7)
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-brand-400" />
                  care@apexbank.co.in
                </li>
                <li className="flex items-center gap-2.5">
                  <Smartphone size={15} className="text-brand-400" />
                  Mobile & Internet banking
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 {APP_NAME} Bank. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              RBI-Regulated | Insured deposits | {TRUST_ITEMS[2]}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
