"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <button className="secondary small" type="button" onClick={signOut}>
      Sign out
    </button>
  );
}
