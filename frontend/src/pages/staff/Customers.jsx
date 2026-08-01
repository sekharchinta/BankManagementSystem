import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import CustomerFormModal from "../../components/customers/CustomerFormModal";
import { listCustomers, deleteCustomer } from "../../services/customers";
import { getErrorMessage } from "../../lib/api";
import { formatDate, formatAccountNumber, initials } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";

export default function Customers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      const result = await listCustomers(params);
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load customers."));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSaved = (message) => {
    toast.success(message);
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCustomer(deleting.id);
      toast.success(`Customer ${deleting.full_name} deleted.`);
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete customer."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const rows = (data?.results || []).map((customer) => ({
    key: customer.id,
    name: customer.full_name,
    email: customer.email,
    phone: customer.phone,
    account: customer.account_number,
    dob: customer.date_of_birth,
    created: customer.created_at,
    customer,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage bank customers and their accounts"
        actions={
          <Button icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
            Add Customer
          </Button>
        }
      />

      <Card noPadding>
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, phone, or email..."
              className="w-full sm:max-w-xs"
            />
            {data && (
              <p className="text-xs text-slate-400">
                {data.count} customer{data.count === 1 ? "" : "s"} found
              </p>
            )}
          </div>
        </div>

        <Table
          columns={[
            {
              key: "name",
              header: "Customer",
              render: (r) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {initials(r.name)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.email}</p>
                  </div>
                </div>
              ),
            },
            { key: "phone", header: "Phone", render: (r) => <span className="text-slate-600">{r.phone || "—"}</span> },
            {
              key: "account",
              header: "Account",
              render: (r) =>
                r.account ? (
                  <Link
                    to="/accounts"
                    className="font-mono text-xs font-medium text-brand-600 hover:underline"
                  >
                    {formatAccountNumber(r.account)}
                  </Link>
                ) : (
                  <Badge tone="amber">No account</Badge>
                ),
            },
            {
              key: "dob",
              header: "Date of Birth",
              render: (r) => <span className="text-slate-500">{r.dob ? formatDate(r.dob) : "—"}</span>,
            },
            {
              key: "created",
              header: "Created",
              render: (r) => <span className="text-slate-500">{r.created ? formatDate(r.created) : "—"}</span>,
            },
            {
              key: "actions",
              header: "",
              align: "right",
              render: (r) => (
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => { setEditing(r.customer); setFormOpen(true); }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(r.customer)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          emptyTitle="No customers found"
          emptyDescription="Try a different search, or add your first customer."
          emptyAction={
            <Button size="sm" icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
              Add Customer
            </Button>
          }
        />

        {data && data.count > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <Pagination
              page={page}
              total={data.count}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <CustomerFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        customer={editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete customer?"
        description={
          deleting
            ? `This will permanently remove ${deleting.full_name} and all linked accounts and transactions.`
            : ""
        }
        confirmLabel="Delete Customer"
      />
    </div>
  );
}
