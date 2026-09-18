# Smart Expense Tracker - Supabase Version

1. Create a Supabase project.
2. Run `supabase.sql` in Supabase SQL Editor.
3. Open `script.js`.
4. Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_PUBLISHABLE_KEY` with your project values.
5. Do NOT use a secret/service-role key in frontend JavaScript.
6. Open `index.html` or deploy the folder to a static host.

This version stores transactions and savings goals in Supabase PostgreSQL instead of localStorage. The included SQL uses anonymous policies for a simple college-project demo. For production, use Supabase Auth and user-specific RLS policies.
