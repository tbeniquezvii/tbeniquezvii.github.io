"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function localDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function ScheduleForm() {
  const router = useRouter();
  const [date, setDate] = useState(localDate());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("S&T");
  const [plannedHours, setPlannedHours] = useState("");
  const [status, setStatus] = useState("Planned");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("schedule").insert({
      date,
      title: title.trim(),
      category,
      planned_hours: plannedHours === "" ? null : Number(plannedHours),
      status,
      notes: notes.trim() || null,
    });

    if (insertError) {
      setError("The schedule item could not be saved.");
      setSaving(false);
      return;
    }

    setTitle("");
    setPlannedHours("");
    setStatus("Planned");
    setNotes("");
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="entry-form" onSubmit={submit}>
      <label>
        Date
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </label>
      <label>
        Category
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>S&amp;T</option>
          <option>Universe Supreme</option>
          <option>Other</option>
        </select>
      </label>
      <label className="wide-field">
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={240} required />
      </label>
      <label>
        Planned hours
        <input type="number" min="0" max="24" step="0.01" value={plannedHours} onChange={(event) => setPlannedHours(event.target.value)} placeholder="Optional" />
      </label>
      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>Planned</option>
          <option>Done</option>
          <option>Skipped</option>
        </select>
      </label>
      <label className="wide-field">
        Notes
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional" />
      </label>
      <button className="primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Add schedule item"}
      </button>
      {error ? <p className="error wide-field">{error}</p> : null}
    </form>
  );
}
