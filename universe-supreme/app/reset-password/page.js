import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "@/components/reset-password-form";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/?error=Open+the+password-reset+link+from+your+email+first.");

  return (
    <main className="shell narrow-shell">
      <header className="brand">
        <p className="eyebrow">nyaLABS · Private</p>
        <h1>Choose a new password</h1>
        <p className="subtitle">This updates the password for Universe Supreme.</p>
      </header>
      <section className="panel">
        <ResetPasswordForm />
      </section>
    </main>
  );
}
