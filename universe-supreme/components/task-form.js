"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("tasks").insert({ title: cleanTitle });

    if (insertError) {
      setError("The task could not be saved.");
      setSaving(false);
      return;
    }

    setTitle("");
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="compact-form" onSubmit={submit}>
      <label htmlFor="task-title">Task</label>
      <div className="inline-fields">
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={240}
          placeholder="Add a task"
          required
        />
        <button className="primary small" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Add task"}
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
