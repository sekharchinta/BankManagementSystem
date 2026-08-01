import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import ResetPasswordModal from "../../components/users/ResetPasswordModal";
import { listUsers } from "../../services/auth";
import { getErrorMessage } from "../../lib/api";
import { formatDate, initials } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";

const ROLE_TONES = {
  ADMIN: "indigo",
  MANAGER: "violet",
  TELLER: "blue",
  CUSTOMER: "slate",
  STAFF: "amber",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listUsers();
      setUsers(result);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const q = debouncedSearch.trim().toLowerCase();
  const filtered = useMemo(() => {
    const all = users || [];
    if (!q) return all;
    return all.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.role?.toLowerCase().includes(q)
    );
  }, [users, q]);

  const rows = filtered.map((user) => ({
    key: user.id,
    user,
  }));

  const handleReset = (message) => {
    toast.success(message);
    setResetting(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage passwords for staff and customer accounts"
      />

      <Card noPadding>
        <div className="border-b border-slate-100 px-5 py-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, username, email, or role..."
            className="w-full sm:max-w-xs"
          />
        </div>

        <Table
          columns={[
            {
              key: "user",
              header: "User",
              render: (r) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {initials(r.user.full_name || r.user.username)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {r.user.full_name || r.user.username}
                    </p>
                    <p className="text-xs text-slate-400">{r.user.email || "No email"}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "username",
              header: "Username",
              render: (r) => (
                <span className="font-mono text-xs text-slate-600">{r.user.username}</span>
              ),
            },
            {
              key: "role",
              header: "Role",
              render: (r) => (
                <Badge tone={ROLE_TONES[r.user.role] || "slate"}>{r.user.role || "—"}</Badge>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Badge tone={r.user.is_active ? "green" : "red"} dot>
                  {r.user.is_active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              key: "joined",
              header: "Joined",
              render: (r) => (
                <span className="text-slate-500">{formatDate(r.user.date_joined)}</span>
              ),
            },
            {
              key: "actions",
              header: "",
              align: "right",
              render: (r) => (
                <button
                  type="button"
                  onClick={() => setResetting(r.user)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  title="Reset password"
                >
                  <KeyRound size={13} />
                  Reset Password
                </button>
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          emptyTitle="No users found"
          emptyDescription="Try a different search."
        />
      </Card>

      <ResetPasswordModal
        open={Boolean(resetting)}
        onClose={() => setResetting(null)}
        user={resetting}
        onReset={handleReset}
      />
    </div>
  );
}
