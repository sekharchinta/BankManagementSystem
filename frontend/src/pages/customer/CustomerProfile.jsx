import { useState } from "react";
import { Mail, Phone, MapPin, Cake, KeyRound, Building2, Save } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/auth";
import { getErrorMessage } from "../../lib/api";
import { formatDate, formatAccountNumber, initials, formatCurrency } from "../../lib/format";
import { useAsync } from "../../hooks/useAsync";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-900">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function CustomerProfile() {
  const { customer, accounts, setStaffProfile } = useAuth();
  const profile = useAsync(() => getProfile(), []);

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [formTouched, setFormTouched] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm: "" });
  const [passErrors, setPassErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const p = profile.data || {};
  const displayName = customer?.full_name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "Customer";

  const syncForm = () => {
    if (!profile.data) return;
    setForm({
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      email: p.email || customer?.email || "",
    });
    setFormTouched(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
      });
      setStaffProfile(updated);
      setFormTouched(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const next = {};
    if (!passwords.old_password) next.old_password = "Current password is required.";
    if (!passwords.new_password) next.new_password = "New password is required.";
    else if (passwords.new_password.length < 8) next.new_password = "Must be at least 8 characters.";
    else if (passwords.new_password !== passwords.confirm) next.confirm = "Passwords do not match.";
    setPassErrors(next);
    if (Object.keys(next).length) return;

    setSavingPassword(true);
    try {
      await changePassword({ old_password: passwords.old_password, new_password: passwords.new_password });
      toast.success("Password updated successfully");
      setPasswords({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to change password.");
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Your personal details and account settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity */}
        <Card className="h-fit">
          <div className="flex flex-col items-center border-b border-slate-100 py-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {initials(displayName)}
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{displayName}</h3>
            <p className="mt-0.5 text-xs text-slate-400">Customer</p>
          </div>
          <div className="divide-y divide-slate-100 px-5">
            <InfoRow icon={Mail} label="Email" value={customer?.email} />
            <InfoRow icon={Phone} label="Phone" value={customer?.phone} />
            <InfoRow icon={Cake} label="Date of Birth" value={customer?.date_of_birth ? formatDate(customer.date_of_birth) : ""} />
            <InfoRow icon={MapPin} label="Address" value={customer?.address} />
          </div>
        </Card>

        {/* Accounts */}
        <Card title="My Accounts" subtitle="All accounts linked to your profile" className="h-fit">
          <div className="space-y-3">
            {accounts.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-400">No accounts found</p>
            )}
            {accounts.map((account) => (
              <div key={account.account_number} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-slate-900">
                      {formatAccountNumber(account.account_number)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {account.account_type} · {account.status}
                    </p>
                  </div>
                </div>
                <p className="tabular-nums text-sm font-bold text-slate-900">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* Editable profile */}
          <Card title="Edit Profile" subtitle="Update your online banking details">
            {profile.loading ? (
              <div className="space-y-3">
                <span className="skeleton block h-10 w-full" />
                <span className="skeleton block h-10 w-full" />
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!formTouched && (
                  <button
                    type="button"
                    onClick={syncForm}
                    className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-500 hover:border-brand-400 hover:text-brand-600 sm:col-span-2"
                  >
                    Load your details for editing
                  </button>
                )}
                {formTouched && (
                  <>
                    <Field label="First name">
                      <Input value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
                    </Field>
                    <Field label="Last name">
                      <Input value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
                    </Field>
                    <Field label="Email" className="sm:col-span-2">
                      <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Button type="submit" icon={Save} loading={savingProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}
          </Card>

          {/* Change password */}
          <Card title="Change Password" subtitle="Keep your account secure">
            <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-4">
              <Field label="Current password" required error={passErrors.old_password}>
                <Input
                  type="password"
                  value={passwords.old_password}
                  onChange={(e) => setPasswords((p) => ({ ...p, old_password: e.target.value }))}
                  autoComplete="current-password"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="New password" required error={passErrors.new_password}>
                  <Input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords((p) => ({ ...p, new_password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm new password" required error={passErrors.confirm}>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    autoComplete="new-password"
                  />
                </Field>
              </div>
              <div>
                <Button type="submit" variant="secondary" icon={KeyRound} loading={savingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
