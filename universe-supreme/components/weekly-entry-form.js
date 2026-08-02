"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function localDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function WeeklyEntryForm() {
  const router = useRouter();
  const [day, setDay] = useState(localDate());
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("weekly_entries").insert({
      day,
      hours_worked: Number(hours),
      task_description: description.trim(),
      status,
    });

    if (insertError) {
      setError("The weekly entry could not be saved.");
      setSaving(false);
      return;
    }

    setHours("");
    setDescription("");
    setStatus("Open");
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="entry-form" onSubmit={submit}>
      <label>
        Day
        <input type="date" value={day} onChange={(event) => setDay(event.target.value)} required />
      </label>
      <label>
        Hours worked
        <input
          type="number"
          min="0.01"
          max="24"
          step="0.01"
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          placeholder="4.5"
          required
        />
      </label>
      <label className="wide-field">
        Task description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
          placeholder="What did you work on?"
          required
        />
      </label>
      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>Open</option>
          <option>In progress</option>
          <option>Complete</option>
        </select>
      </label>
      <button className="primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Log weekly entry"}
      </button>
      {error ? <p className="error wide-field">{error}</p> : null}
    </form>
  );
}
