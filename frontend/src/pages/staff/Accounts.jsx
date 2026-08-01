import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import Badge, { statusTone } from "../../components/ui/Badge";
import AccountCreateModal from "../../components/accounts/AccountCreateModal";
import { listAccounts } from "../../services/accounts";
import { getErrorMessage } from "../../lib/api";
import { formatAccountNumber, formatCurrency, formatDate } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";

export default function Accounts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listAccounts({ page });
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load accounts."));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleCreated = (message) => {
    setShowCreate(false);
    toast.success(message);
    load();
  };

  const all = data?.results || [];
  const q = debouncedSearch.trim().toLowerCase();
  const filtered = q
    ? all.filter(
        (account) =>
          account.account_number?.toLowerCase().includes(q) ||
          account.customer_name?.toLowerCase().includes(q)
      )
    : all;

  const rows = filtered.map((account) => ({
    key: account.account_number,
    account,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="All customer accounts and balances"
        actions={
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            Create Account
          </Button>
        }
      />

      <Card noPadding>
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by account number or customer name..."
              className="w-full sm:max-w-xs"
            />
            {data && (
              <p className="text-xs text-slate-400">
                {data.count} account{data.count === 1 ? "" : "s"} in the bank
              </p>
            )}
          </div>
        </div>

        <Table
          columns={[
            {
              key: "account_number",
              header: "Account Number",
              render: (r) => (
                <span className="font-mono text-xs font-medium text-slate-900">
                  {formatAccountNumber(r.account.account_number)}
                </span>
              ),
            },
            {
              key: "customer",
              header: "Customer",
              render: (r) => (
                <span className="font-medium text-slate-900">{r.account.customer_name}</span>
              ),
            },
            {
              key: "type",
              header: "Type",
              render: (r) => (
                <Badge tone={statusTone(r.account.account_type)}>{r.account.account_type}</Badge>
              ),
            },
            {
              key: "balance",
              header: "Balance",
              align: "right",
              render: (r) => (
                <span className="tabular-nums font-semibold text-slate-900">
                  {formatCurrency(r.account.balance)}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Badge tone={statusTone(r.account.status)} dot>
                  {r.account.status}
                </Badge>
              ),
            },
            {
              key: "created_at",
              header: "Created",
              render: (r) => (
                <span className="text-slate-500">{formatDate(r.account.created_at)}</span>
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          emptyTitle="No accounts found"
          emptyDescription="Accounts are created automatically when you add a customer."
        />

        {data && data.count > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <Pagination page={page} total={data.count} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <AccountCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
