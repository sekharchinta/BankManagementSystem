import { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../../services/customers";
import { getErrorMessage } from "../../lib/api";
import { ACCOUNT_TYPES } from "../../lib/constants";
import { toISODate } from "../../lib/format";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input, Select, Textarea } from "../ui/Field";

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  date_of_birth: "",
  account_type: "Savings",
};

export default function CustomerFormModal({ open, onClose, customer, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(customer?.id);

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        customer
          ? {
              full_name: customer.full_name || "",
              email: customer.email || "",
              phone: customer.phone || "",
              address: customer.address || "",
              date_of_birth: customer.date_of_birth
                ? toISODate(customer.date_of_birth)
                : "",
              account_type: customer.account_type || "Savings",
            }
          : EMPTY
      );
    }
  }, [open, customer]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.full_name.trim()) next.full_name = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!/^[+\d][\d\s-]{6,14}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.date_of_birth) next.date_of_birth = "Date of birth is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        date_of_birth: form.date_of_birth,
      };
      if (!isEdit) payload.account_type = form.account_type;

      if (isEdit) {
        await updateCustomer(customer.id, payload);
      } else {
        await createCustomer(payload);
      }
      onSaved(isEdit ? "Customer updated successfully" : "Customer created successfully");
    } catch (err) {
      const message = getErrorMessage(err, "Failed to save customer.");
      if (message.toLowerCase().includes("email")) setErrors((e) => ({ ...e, email: message }));
      else if (message.toLowerCase().includes("phone")) setErrors((e) => ({ ...e, phone: message }));
      else setErrors((e) => ({ ...e, form: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Customer" : "Add New Customer"}
      subtitle={
        isEdit
          ? `Updating details for ${customer?.full_name}`
          : "A new savings or current account will be created automatically"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            {isEdit ? "Save Changes" : "Create Customer"}
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

        <Field label="Full name" required error={errors.full_name} className="sm:col-span-2">
          <Input
            value={form.full_name}
            onChange={setField("full_name")}
            placeholder="Enter customer's full name"
          />
        </Field>

        <Field label="Email" required error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={setField("email")}
            placeholder="Enter email address"
          />
        </Field>

        <Field label="Phone" required error={errors.phone}>
          <Input
            type="tel"
            value={form.phone}
            onChange={setField("phone")}
            placeholder="Enter 10-digit mobile number"
          />
        </Field>

        <Field label="Date of birth" required error={errors.date_of_birth}>
          <Input type="date" value={form.date_of_birth} onChange={setField("date_of_birth")} />
        </Field>

        <Field
          label="Account type"
          hint={isEdit ? "Account type is fixed after creation" : "Applied to the auto-created account"}
        >
          <Select value={form.account_type} onChange={setField("account_type")} disabled={isEdit}>
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Address" className="sm:col-span-2">
          <Textarea
            value={form.address}
            onChange={setField("address")}
            rows={2}
            placeholder="Residential address"
          />
        </Field>
      </form>
    </Modal>
  );
}
