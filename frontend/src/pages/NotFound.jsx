import { FileQuestion, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";

export default function NotFound() {
  const { isStaff, isCustomer } = useAuth();
  const homePath = isStaff ? "/dashboard" : isCustomer ? "/customer" : "/login";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Logo size="lg" className="mb-6" />
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
          <FileQuestion size={40} className="text-slate-400" />
        </div>
        <h1 className="mt-6 text-6xl font-black tracking-tight text-white">404</h1>
        <p className="mt-3 max-w-sm text-sm text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to={homePath} className="mt-8">
          <Button size="lg" icon={Home}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
