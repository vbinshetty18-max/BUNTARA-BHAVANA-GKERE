# Buntara Bhavana booking site

## Run locally

```powershell
npm install
npm run dev
```

The customer site is served at `/`. The customer site is public and open: visitors can browse, view galleries, and submit hall bookings directly without creating an account or signing in. The separate administrator page is at `/admin`.

## Configure Supabase

The application uses Supabase Postgres, Storage, and Edge Functions for public booking requests, venue management, and gallery images.

1. Create a project at [Supabase Dashboard](https://supabase.com/dashboard).
2. In the project dashboard, open **Project Settings → API** (or **Connect**) and copy the **Project URL** and the **publishable key**. Older projects may show an `anon`/public key instead.
3. Copy `.env.example` to `.env`, then set:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
   ```

   For an older project, use `VITE_SUPABASE_ANON_KEY` instead of `VITE_SUPABASE_PUBLISHABLE_KEY`. The app accepts either.
4. Open **SQL Editor → New query**. For a fresh project, run in order:
   - `supabase/migrations/20261113000000_admin_dashboard.sql` (base schema, tables, roles)
   - `supabase/migrations/20261118000000_auto_booking_confirmation.sql` (date uniqueness and email workflow)
   - `supabase/migrations/20261118170000_public_booking_submission.sql` (enables direct public visitor booking requests without login)
5. In **Authentication → Settings**, configure email confirmation as desired and set a minimum password length of 8 characters. (Authentication is strictly restricted to administrator accounts at `/admin`).
6. To email each customer when their booking is approved by an administrator, deploy the `send-booking-confirmation-email` Supabase Edge Function and configure Resend:

   ```powershell
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set RESEND_API_KEY=re_your_api_key RESEND_FROM_EMAIL="Buntara Bhavana <bookings@your-verified-domain>"
   supabase functions deploy send-booking-confirmation-email
   ```

   Verify the sender domain with Resend before sending. Keep the Resend API key in Supabase Function secrets only; never put it in `.env` or a `VITE_` variable. When an administrator approves a booking in `/admin`, the confirmation email is dispatched to the customer's provided email.
7. Restart `npm run dev`. Vite reads `.env` at startup.

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

## Booking & Gallery Flow

- **No User Sign-In Required for Visitors:** Public visitors can browse all halls, view pricing, inspect amenities, and submit booking requests without creating an account or logging in.
- **Direct Submission to Administration Dashboard:** Customer booking details (name, phone, email, date, session, hall selection, guest count, and notes) are saved directly to Supabase (`booking_enquiries` table with `status = 'pending'`). They immediately show up in the `/admin` Bookings tab for review, approval, or rejection.
- **Read-Only Customer Gallery:** The public gallery strictly presents photographs of the halls, exterior, and events in a clean view-only gallery. Image uploads, file inputs, and removals are exclusively restricted to the `/admin` panel under the Gallery tab.
- **Strictly Restricted Authentication:** Authentication is kept exclusively on `/admin` for authorized hall administrators.

## Google Gemini API Feature: Tulunadu AI Event Planner & Concierge

The website includes an intelligent **AI Event & Muhurtham Planner** and **24/7 AI Heritage Concierge** powered by Google Gemini (`gemini-4-hydrogen` / `gemini-3.5-flash-lite` via the official `@google/genai` SDK):

1. **Tulunadu AI Event Planner**:
   - Analyzes event type, guest count, session timings, and traditional requirements.
   - Recommends the optimal hall (Malady Tunga AC ₹75k, Kaashi Shetty Non-AC ₹35k, or Arvaguthu Mini ₹12k).
   - Generates an itemized budget breakdown (Hall rent + pure vegetarian banana leaf catering estimate + floral decor + audio/lighting).
   - Crafts an authentic Tulunadu auspicious schedule & timeline.
   - Drafts bespoke traditional invitation card wording in English and Kannada.
   - Includes one-click **"Pre-Fill & Confirm Booking"** to immediately transfer the recommendation into the venue booking system.

2. **24/7 AI Heritage Concierge**:
   - Floating interactive assistant answering queries regarding venue amenities, senior citizen lift access, parking, traditional dining hall rules, and session timings.
   - Stateful multi-turn conversation with memory using the Gemini Interactions API.

3. **Configuration**:
   - Add your Gemini API key in `.env`:
     ```dotenv
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Alternatively, visitors or administrators can configure/test their Gemini key directly in the UI via the **Gemini AI Settings** modal.
   - When no key is entered, the website automatically falls back to curated local venue intelligence, ensuring a 100% clean and working experience out of the box.
