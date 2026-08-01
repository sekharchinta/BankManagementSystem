import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { setUserPassword } from "../../services/auth";
import { getErrorMessage } from "../../lib/api";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Field";

export default function ResetPasswordModal({ open, onClose, user, onReset }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      setErrors({});
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!password) next.password = "New password is required.";
    else if (password.length < 8) next.password = "Must be at least 8 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await setUserPassword(user.id, password);
      onReset(`Password updated for ${user.full_name || user.username}`);
    } catch (err) {
      setErrors((e) => ({
        ...e,
        form: getErrorMessage(err, "Failed to update password."),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reset Password"
      subtitle={user ? `Set a new password for ${user.full_name || user.username}` : ""}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Update Password
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
            {errors.form}
          </p>
        )}

        <Field label="New password" required hint="Minimum 8 characters" error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="pr-10"
              autoComplete="new-password"
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

        <Field label="Confirm new password" required error={errors.confirm}>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
        </Field>
      </form>
    </Modal>
  );
}
