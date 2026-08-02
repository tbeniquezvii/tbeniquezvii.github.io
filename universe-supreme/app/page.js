import { OWNER_EMAIL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/login-form";
import SignOutButton from "@/components/sign-out-button";
import TaskForm from "@/components/task-form";
import WeeklyEntryForm from "@/components/weekly-entry-form";
import StatusSelect from "@/components/status-select";

function formatDay(value) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function startOfWeek(value) {
  const date = new Date(`${value}T00:00:00Z`);
  const day = date.getUTCDay();
  const distance = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + distance);
  return date.toISOString().slice(0, 10);
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL;

  if (!isOwner) {
    if (user) await supabase.auth.signOut();
    return (
      <main className="shell narrow-shell">
        <header className="brand">
          <p className="eyebrow">nyaLABS · Private</p>
          <h1>Universe Supreme</h1>
          <p className="subtitle">Your independent personal platform.</p>
        </header>
        <section className="panel">
          <div className="panel-header"><h2>Private access</h2></div>
          <p className="account">This platform accepts only Nyabe&apos;s account.</p>
          {params?.error ? <p className="error">{params.error}</p> : null}
          <LoginForm />
        </section>
      </main>
    );
  }

  const [{ data: tasks, error: tasksError }, { data: entries, error: entriesError }] = await Promise.all([
    supabase.from("tasks").select("id,title,created_at").order("created_at", { ascending: false }),
    supabase
      .from("weekly_entries")
      .select("id,day,hours_worked,task_description,status,created_at")
      .order("day", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const groupedEntries = new Map();
  for (const entry of entries || []) {
    const week = startOfWeek(entry.day);
    if (!groupedEntries.has(week)) groupedEntries.set(week, []);
    groupedEntries.get(week).push(entry);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">nyaLABS · Private</p>
          <h1>Universe Supreme</h1>
          <p className="subtitle">Step 1 tasks and Step 2 S&amp;T weekly work records.</p>
        </div>
        <SignOutButton />
      </header>

      <section className="panel section-panel">
        <div className="panel-header split-header">
          <div>
            <p className="section-kicker">Step 1</p>
            <h2>Tasks</h2>
          </div>
          <span className="count-pill">{tasks?.length || 0} saved</span>
        </div>
        <TaskForm />
        {tasksError ? <p className="error">Tasks could not be loaded.</p> : null}
        <div className="simple-list">
          {(tasks || []).map((task) => <div className="simple-row" key={task.id}>{task.title}</div>)}
          {!tasks?.length && !tasksError ? <p className="empty">No tasks saved yet.</p> : null}
        </div>
      </section>

      <section className="panel section-panel">
        <div className="panel-header split-header">
          <div>
            <p className="section-kicker">Step 2 · S&amp;T HVAC &amp; Refrigeration</p>
            <h2>Weekly work hours and tasks</h2>
          </div>
          <span className="count-pill">{entries?.length || 0} entries</span>
        </div>
        <WeeklyEntryForm />
        {entriesError ? <p className="error">Weekly entries could not be loaded.</p> : null}
        <div className="week-list">
          {[...groupedEntries.entries()].map(([week, weekEntries]) => {
            const total = weekEntries.reduce((sum, entry) => sum + Number(entry.hours_worked), 0);
            return (
              <section className="week-block" key={week}>
                <div className="week-heading">
                  <h3>Week of {formatDay(week)}</h3>
                  <strong>{total.toFixed(2).replace(/\.00$/, "")} hours</strong>
                </div>
                <div className="entries-table">
                  <div className="entry-row entry-head">
                    <span>Day</span><span>Hours</span><span>Task</span><span>Status</span>
                  </div>
                  {weekEntries.map((entry) => (
                    <div className="entry-row" key={entry.id}>
                      <span>{formatDay(entry.day)}</span>
                      <span>{Number(entry.hours_worked).toFixed(2).replace(/\.00$/, "")}</span>
                      <span>{entry.task_description}</span>
                      <StatusSelect id={entry.id} initialStatus={entry.status} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          {!entries?.length && !entriesError ? <p className="empty">No S&amp;T weekly entries saved yet.</p> : null}
        </div>
      </section>
    </main>
  );
}
