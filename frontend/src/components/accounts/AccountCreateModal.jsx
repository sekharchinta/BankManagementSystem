import { useEffect, useState } from "react";
import { createAccount } from "../../services/accounts";
import { reportCustomers } from "../../services/reports";
import { getErrorMessage } from "../../lib/api";
import { ACCOUNT_TYPES } from "../../lib/constants";
import { formatAccountNumber } from "../../lib/format";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input, Select } from "../ui/Field";

const EMPTY = {
  customer_id: "",
  account_type: "Savings",
  initial_balance: "",
  status: "Active",
};

export default function AccountCreateModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(EMPTY);
    reportCustomers()
      .then((list) => setCustomers(Array.isArray(list) ? list : []))
      .catch(() => setCustomers([]));
  }, [open]);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.customer_id) next.customer_id = "Please select a customer.";
    const balance = form.initial_balance === "" ? 0 : Number(form.initial_balance);
    if (Number.isNaN(balance) || balance < 0) next.initial_balance = "Enter a valid amount.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await createAccount({
        customer_id: Number(form.customer_id),
        account_type: form.account_type,
        initial_balance: balance,
        status: form.status,
      });
      onCreated("Account created successfully");
    } catch (err) {
      setErrors((e) => ({
        ...e,
        form: getErrorMessage(err, "Failed to create account."),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Account"
      subtitle="Open an additional savings or current account for an existing customer"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Create Account
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {errors.form && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700 sm:col-span-2">
            {errors.form}
          </p>
        )}

        <Field label="Customer" required error={errors.customer_id} className="sm:col-span-2">
          <Select value={form.customer_id} onChange={setField("customer_id")}>
            <option value="">Select a customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
                {c.account_number ? ` (${formatAccountNumber(c.account_number)})` : ""}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Account type" required>
          <Select value={form.account_type} onChange={setField("account_type")}>
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Initial balance"
          hint="Optional opening deposit"
          error={errors.initial_balance}
        >
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.initial_balance}
            onChange={setField("initial_balance")}
            placeholder="0.00"
          />
        </Field>

        <Field label="Status" className="sm:col-span-2">
          <Select value={form.status} onChange={setField("status")}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </Field>
      </form>
    </Modal>
  );
}
