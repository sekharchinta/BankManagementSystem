import { useState } from "react";
import { UserRound, KeyRound, Mail, User, Save } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/auth";
import { getErrorMessage } from "../../lib/api";
import { initials } from "../../lib/format";
import { useAsync } from "../../hooks/useAsync";

export default function Profile() {
  const { setStaffProfile } = useAuth();
  const profile = useAsync(() => getProfile(), []);

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", username: "" });
  const [formTouched, setFormTouched] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm: "" });
  const [passErrors, setPassErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const p = profile.data || {};
  const isFormLoaded = formTouched || Object.values(form).some((v) => v);

  const syncForm = () => {
    if (!profile.data) return;
    setForm({
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      email: p.email || "",
      username: p.username || "",
    });
    setFormTouched(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
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
      await changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      toast.success("Password updated successfully");
      setPasswords({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to change password.");
      toast.error(message);
      if (message.toLowerCase().includes("old")) {
        setPassErrors((e) => ({ ...e, old_password: message }));
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const displayName = [p.first_name, p.last_name].filter(Boolean).join(" ") || p.username || "Staff";

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your staff account and security" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <Card className="h-fit">
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {initials(displayName)}
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{displayName}</h3>
            <p className="mt-0.5 text-sm text-slate-500">@{p.username || "staff"}</p>
            <div className="mt-4 flex w-full flex-col gap-2 border-t border-slate-100 pt-4 text-left text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail size={14} className="text-slate-400" />
                {p.email || "—"}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <User size={14} className="text-slate-400" />
                Staff role
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <UserRound size={14} className="text-slate-400" />
                {profile.loading ? "Loading..." : "Authenticated via JWT"}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* Edit profile */}
          <Card title="Account Information" subtitle="Update your personal details">
            {profile.loading ? (
              <div className="space-y-3">
                <span className="skeleton block h-10 w-full" />
                <span className="skeleton block h-10 w-full" />
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!isFormLoaded && (
                  <button
                    type="button"
                    onClick={syncForm}
                    className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-500 hover:border-brand-400 hover:text-brand-600 sm:col-span-2"
                  >
                    Load profile data for editing
                  </button>
                )}

                {isFormLoaded && (
                  <>
                    <Field label="First name">
                      <Input value={form.first_name} onChange={(e) => { setForm((f) => ({ ...f, first_name: e.target.value })); setFormTouched(true); }} />
                    </Field>
                    <Field label="Last name">
                      <Input value={form.last_name} onChange={(e) => { setForm((f) => ({ ...f, last_name: e.target.value })); setFormTouched(true); }} />
                    </Field>
                    <Field label="Email" required>
                      <Input type="email" value={form.email} onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setFormTouched(true); }} />
                    </Field>
                    <Field label="Username">
                      <Input value={form.username} onChange={(e) => { setForm((f) => ({ ...f, username: e.target.value })); setFormTouched(true); }} />
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
          <Card title="Change Password" subtitle="Choose a strong password you don't use elsewhere">
            <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-4">
              <Field label="Current password" required error={passErrors.old_password}>
                <Input
                  type="password"
                  value={passwords.old_password}
                  onChange={(e) => setPasswords((p) => ({ ...p, old_password: e.target.value }))}
                  placeholder="Enter current password"
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
                    placeholder="Re-enter new password"
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
