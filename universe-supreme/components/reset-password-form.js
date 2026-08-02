"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || "The password could not be changed.");
      setSaving(false);
      return;
    }

    setMessage("Password changed. Returning to Universe Supreme…");
    setTimeout(() => window.location.assign("/"), 1200);
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label htmlFor="new-password">New password</label>
      <input
        id="new-password"
        type="password"
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />
      <label htmlFor="confirm-password">Confirm new password</label>
      <input
        id="confirm-password"
        type="password"
        minLength={8}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        autoComplete="new-password"
        required
      />
      <button className="primary" type="submit" disabled={saving}>
        {saving ? "Changing password…" : "Set new password"}
      </button>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}
    </form>
  );
}
