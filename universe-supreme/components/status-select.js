"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StatusSelect({ id, initialStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(nextStatus) {
    setStatus(nextStatus);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("weekly_entries").update({ status: nextStatus }).eq("id", id);
    setSaving(false);
    if (error) {
      setStatus(initialStatus);
      return;
    }
    router.refresh();
  }

  return (
    <select
      className="status-select"
      aria-label="Entry status"
      value={status}
      onChange={(event) => update(event.target.value)}
      disabled={saving}
    >
      <option>Open</option>
      <option>In progress</option>
      <option>Complete</option>
    </select>
  );
}
