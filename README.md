# Buntara Bhavana booking site

## Run locally

```powershell
npm install
npm run dev
```

The customer site is served at `/`. The separate administrator page is at `/admin`.

## Configure Supabase

The application uses Supabase Auth, Postgres, and Storage for shared customer profiles, booking requests, venue information, and gallery images.

1. Create a project at [Supabase Dashboard](https://supabase.com/dashboard).
2. In the project dashboard, open **Project Settings → API** (or **Connect**) and copy the **Project URL** and the **publishable key**. Older projects may show an `anon`/public key instead.
3. Copy `.env.example` to `.env`, then set:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
   ```

   For an older project, use `VITE_SUPABASE_ANON_KEY` instead of `VITE_SUPABASE_PUBLISHABLE_KEY`. The app accepts either.
4. Open **SQL Editor → New query**, paste the contents of `supabase/migrations/20261113000000_admin_dashboard.sql`, and run it. If you already ran an earlier version of this migration, run the updated file again to enable guest booking submissions.
5. In **Authentication → Settings**, configure email confirmation as desired and set a minimum password length of 8 characters.
6. Restart `npm run dev`. Vite reads `.env` at startup.

The `.env` file is git-ignored. Only use the publishable/anon public key in the Vite environment. Never put the Supabase service-role or secret key in this frontend repository or in a `VITE_` variable.

## Provision the first administrator

1. Create the administrator account in Supabase Dashboard → Authentication → Users. The public website has no administrator registration page.
2. Copy the new user's UUID from the Auth Users list.
3. Run this in the Supabase SQL Editor, replacing the placeholder with that UUID:

```sql
update public.profiles
set role = 'admin'
where id = 'REPLACE-WITH-AUTH-USER-UUID';
```

4. Sign in at `/admin`. The dashboard checks the profile role on the server and the database policies restrict privileged changes to active administrators.

## Data behavior

- Customer registration, profiles, and booking requests are stored in Supabase; customer login uses email and password. Visitors may also submit a booking enquiry without an account by providing their name and phone number.
- Guest enquiries are stored as pending bookings without a profile link. Administrators can review them, but guests must keep the reference ID and contact the venue to follow up; guest requests do not appear in customer booking history.
- Admins can approve/reject booking requests, edit hall details and visibility, update public website copy and event/facility entries, upload gallery images, and suspend/restore customer profiles.
- Approvals are checked against other approved bookings for the same hall, date, and overlapping session.
- Existing browser-only accounts do not become Supabase accounts automatically. Users should register with the same username, then choose **Import previous booking requests** in their profile menu. Imported requests are submitted as pending so an administrator can review them.
- If Supabase is not configured, both the customer auth actions and admin dashboard remain unavailable; the app does not fall back to insecure local-password storage.
