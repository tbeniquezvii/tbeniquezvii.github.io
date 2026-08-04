"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TaskItem({ task }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function close() {
    setTitle(task.title);
    setConfirmingDelete(false);
    setError("");
    setOpen(false);
  }

  async function save(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ title: cleanTitle })
      .eq("id", task.id);

    if (updateError) {
      setError("The task could not be updated.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  async function remove() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", task.id);

    if (deleteError) {
      setError("The task could not be deleted.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button className="simple-row task-row" type="button" onClick={() => setOpen(true)}>
        <span>{task.title}</span>
        <span className="task-row-action">Edit</span>
      </button>
    );
  }

  return (
    <form className="task-editor" onSubmit={save}>
      <label htmlFor={`task-title-${task.id}`}>Task title</label>
      <input
        id={`task-title-${task.id}`}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={240}
        required
        autoFocus
      />
      {error ? <p className="error">{error}</p> : null}
      {confirmingDelete ? (
        <div className="delete-confirmation" role="alert">
          <p>Delete this task? This cannot be undone.</p>
          <div className="task-actions">
            <button className="secondary small" type="button" onClick={() => setConfirmingDelete(false)} disabled={saving}>Cancel</button>
            <button className="danger small" type="button" onClick={remove} disabled={saving}>{saving ? "Deleting…" : "Yes, delete task"}</button>
          </div>
        </div>
      ) : (
        <div className="task-actions">
          <button className="secondary small" type="button" onClick={close} disabled={saving}>Cancel</button>
          <button className="danger-link small" type="button" onClick={() => setConfirmingDelete(true)} disabled={saving}>Delete</button>
          <button className="primary small" type="submit" disabled={saving || !title.trim()}>{saving ? "Saving…" : "Save title"}</button>
        </div>
      )}
    </form>
  );
}
