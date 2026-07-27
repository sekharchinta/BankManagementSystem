import React from "react";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="p-6">

          <h2 className="text-xl font-semibold text-slate-800">
            {title}
          </h2>

          <p className="mt-3 text-slate-500">
            {message}
          </p>

        </div>

        <div className="border-t p-5 flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>

      </div>

    </div>
  );
}