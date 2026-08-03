# Universe Supreme

Private Next.js application for Nyabe, backed by the clean Supabase project `Universe Supreme Step 1`.

## Verified scope

- Step 1: private password authentication, recovery flow, and persistent `tasks` records.
- Step 2: S&T HVAC & Refrigeration weekly work entries using `weekly_entries` (`day`, `hours_worked`, `task_description`, `status`).

## Deployment

The Vercel project `universe-supreme` is connected to this folder on the `main` branch.

No service-role or secret key is stored in this repository. The browser uses the Supabase publishable key and database access is restricted by Row Level Security.
