"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OWNER_EMAIL } from "@/lib/constants";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [opening, setOpening] = useState(false);
  const [sending, setSending] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setOpening(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: OWNER_EMAIL,
      password,
    });

    if (signInError) {
      setError("That password did not work.");
      setOpening(false);
      return;
    }

    window.location.assign("/");
  }

  async function recoverPassword() {
    setSending(true);
    setError("");
    setSuccess("");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(OWNER_EMAIL, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetError) {
      setError("The recovery email could not be sent. Try again.");
      setSending(false);
      return;
    }

    setSuccess(`A secure password-reset link was sent to ${OWNER_EMAIL}.`);
    setSending(false);
  }

  return (
    <form className="login-form" onSubmit={signIn}>
      <label htmlFor="password">Private account password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        required
      />
      <button className="primary" type="submit" disabled={opening}>
        {opening ? "Opening…" : "Enter Universe Supreme"}
      </button>
      <button className="text-button" type="button" onClick={recoverPassword} disabled={sending}>
        {sending ? "Sending recovery email…" : "Forgot password?"}
      </button>
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}
    </form>
  );
}
