// Supabase Edge Function: send-booking-email
// Validates booking record against Supabase database before dispatching email via Gmail SMTP (Nodemailer)
// Prevents unauthorized or arbitrary email delivery on --no-verify-jwt endpoint

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.9.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const VENUE_NAME = 'Buntara Bhavana';
const VENUE_LOCATION = 'Guruvayanakere, Belthangady, Karnataka 574217';
const VENUE_PLUS_CODE = 'X7P4+82X BUNTARA BHAVANA';
const VENUE_PHONE = '+91 8256 232 456';
const VENUE_HOURS = '9:30 AM – 6:00 PM';
const MAPS_URL = 'https://maps.google.com/?q=Buntara+Bhavana,+Guruvayanakere,+Belthangady,+Karnataka+574217';

function baseEmailWrapper(contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buntara Bhavana - Guruvayankere</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050C16; font-family: 'Georgia', 'Times New Roman', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050C16; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #0B192C; border: 2px solid #C99A43; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header: Royal Navy & Gold -->
          <tr>
            <td style="background-color: #081220; padding: 32px 24px 24px; text-align: center; border-bottom: 2px solid #C99A43;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #741B1B 0%, #451010 100%); border: 1.5px solid #C99A43; line-height: 44px; text-align: center; font-size: 22px; color: #F3CF7A; margin-bottom: 12px;">
                      🏛️
                    </div>
                    <h1 style="margin: 0; color: #FFF9EE; font-size: 26px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">BUNTARA BHAVANA</h1>
                    <p style="margin: 6px 0 0; color: #C99A43; font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Guruvayankere • Heritage Celebration Venue</p>
                    <div style="width: 80px; height: 2px; background: linear-gradient(90deg, transparent, #C99A43, transparent); margin: 14px auto 0;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Content Body -->
          <tr>
            <td style="padding: 32px 28px 24px; background-color: #0B192C; color: #FFF9EE;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Venue Contact & Location Card -->
          <tr>
            <td style="padding: 0 28px 24px; background-color: #0B192C;">
              <table role="presentation" width="100%" style="background-color: #112239; border: 1px solid rgba(201, 154, 67, 0.4); border-radius: 8px; padding: 18px 20px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="color: #FFF9EE; font-size: 13px; line-height: 1.6;">
                    <strong style="color: #F3CF7A; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">📍 Venue Location &amp; Contact:</strong><br>
                    <span style="color: #E2E8F0;">${VENUE_PLUS_CODE}, ${VENUE_LOCATION}</span><br>
                    <span style="color: #CBD5E1;">📞 Helpdesk: <strong>${VENUE_PHONE}</strong> (${VENUE_HOURS})</span><br>
                    <a href="${MAPS_URL}" target="_blank" style="color: #F3CF7A; text-decoration: underline; font-weight: 600; font-size: 12px; display: inline-block; margin-top: 6px;">Open in Google Maps &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #060E18; padding: 22px 24px; text-align: center; border-top: 1px solid rgba(201, 154, 67, 0.3);">
              <p style="margin: 0; color: #94A3B8; font-size: 11px; line-height: 1.6;">
                &copy; ${new Date().getFullYear()} <strong style="color: #C99A43;">Buntara Bhavana – Guruvayankere</strong>. All rights reserved.<br>
                Honoring milestones with Tulunadu cultural heritage, sacred grandeur, and traditional hospitality.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req: Request) => {
  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let customerEmail = '';

  try {
    // 2. Secret & Environment Handling: Gmail SMTP via Nodemailer
    const gmailUser = (Deno.env.get('GMAIL_USER') || 'buntarabhavanagkere@gmail.com').trim();
    const gmailAppPassword = (Deno.env.get('GMAIL_APP_PASSWORD') || '').replace(/\s+/g, '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Safe logging without leaking credentials
    console.log(`[Edge Function Secrets Check] GMAIL_USER present: ${Boolean(Deno.env.get('GMAIL_USER'))} (using ${gmailUser}), GMAIL_APP_PASSWORD length: ${gmailAppPassword.length}`);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Edge Function Error] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment.');
      return new Response(
        JSON.stringify({ success: false, error: 'Database service configuration is missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!gmailAppPassword) {
      console.error('[Edge Function Error] GMAIL_APP_PASSWORD secret is missing in Supabase Edge Function Secrets.');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing GMAIL_APP_PASSWORD secret in Supabase'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse and require bookingId and status
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON request body.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bookingId = (body.bookingId || body.booking_id || '') as string;
    const requestedStatus = (body.status || body.action || '') as string;

    if (!bookingId || typeof bookingId !== 'string' || !bookingId.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'A valid bookingId is required to send notification emails.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Query Database using Service Role to verify booking existence and fetch verified details
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    let bookingRecord: Record<string, unknown> | null = null;

    // Check primary booking_enquiries table (including number_of_guests)
    const { data: enquiry, error: enquiryError } = await supabase
      .from('booking_enquiries')
      .select('id, reference_code, customer_name, email_address, mobile_number, hall_name, event_date, session, event_type, number_of_guests, status, profile_id')
      .eq('id', bookingId.trim())
      .maybeSingle();

    if (enquiryError) {
      console.error('[Edge Function DB Error]:', enquiryError);
    }

    if (enquiry) {
      bookingRecord = enquiry;
    } else {
      // Fallback check bookings table if present
      const { data: bookingItem } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId.trim())
        .maybeSingle();
      if (bookingItem) {
        bookingRecord = bookingItem;
      }
    }

    // Anti-Abuse Check: Reject if bookingId does not exist in the database
    if (!bookingRecord) {
      console.warn(`[Edge Function Security Block] Booking ID "${bookingId}" not found in database. Email dispatch aborted.`);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid booking ID' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Determine Recipient (to): strictly customer's email from request body or look it up from booking_enquiries
    const bodyEmail = (
      body.to ||
      body.customer_email ||
      body.customerEmail ||
      body.email ||
      body.recipient ||
      (body.booking as Record<string, unknown>)?.customerEmail ||
      (body.booking as Record<string, unknown>)?.email ||
      ''
    ) as string;

    if (typeof bodyEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bodyEmail.trim())) {
      customerEmail = bodyEmail.trim();
    }

    // Fallback: look up customer email from booking_enquiries using bookingId
    if (!customerEmail) {
      const dbEmail = String(bookingRecord.email_address || '').trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dbEmail)) {
        customerEmail = dbEmail;
      } else if (bookingRecord.profile_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', bookingRecord.profile_id)
          .maybeSingle();
        if (profile?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(profile.email).trim())) {
          customerEmail = String(profile.email).trim();
        }
      }
    }

    // Strictly validate customer email and return 400 if no valid customer email exists
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      console.error(`[Edge Function Error] Booking ${bookingId} has no valid customer email address.`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'A valid customer email address is required to deliver booking notifications.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerName = String(bookingRecord.customer_name || 'Valued Guest');
    const hallName = String(bookingRecord.hall_name || 'Buntara Bhavana');
    const eventDate = String(bookingRecord.event_date || '');
    const sessionSlot = String(bookingRecord.session || '');
    const eventType = String(bookingRecord.event_type || 'Celebration');
    const referenceCode = String(bookingRecord.reference_code || bookingId.slice(0, 8).toUpperCase());
    const guestCount = bookingRecord.number_of_guests ? `${bookingRecord.number_of_guests} Guests` : 'Standard Capacity';

    // Determine action status: from requested status or database record status
    const statusNormalized = (requestedStatus || String(bookingRecord.status) || 'approved').toLowerCase();
    const action = (statusNormalized === 'approved' || statusNormalized === 'confirmed')
      ? 'approved'
      : (statusNormalized === 'cancelled')
      ? 'cancelled'
      : 'rejected';

    // 6. Construct Royal Navy & Gold email templates with complete booking details
    let subject = '';
    let bodyText = '';
    let contentHtml = '';

    if (action === 'approved') {
      subject = eventDate
        ? `Booking Confirmed - Buntara Bhavana, Guruvayanakere (${eventDate})`
        : 'Booking Confirmed - Buntara Bhavana, Guruvayanakere';

      contentHtml = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #34D399; border: 1.5px solid #10B981; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
            BOOKING CONFIRMED
          </span>
        </div>

        <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
          Namaskara <strong style="color: #F3CF7A;">${customerName}</strong>,
        </p>

        <p style="font-size: 14px; margin: 0 0 24px; color: #E2E8F0; line-height: 1.7;">
          We are delighted to confirm that your booking request for <strong>${eventType}</strong> has been officially approved by the Buntara Bhavana administration. We are honored to host your auspicious celebration.
        </p>

        <table role="presentation" width="100%" style="background-color: #112239; border: 1.5px solid #C99A43; border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 20px 22px;">
              <h3 style="margin: 0 0 14px; color: #F3CF7A; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid rgba(201, 154, 67, 0.3); padding-bottom: 8px;">
                Booking Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="color: #FFF9EE; font-size: 13px;">
                <tr>
                  <td width="38%" style="color: #94A3B8; vertical-align: top;">Customer Name:</td>
                  <td width="62%"><strong style="color: #FFFFFF;">${customerName}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Reference ID:</td>
                  <td><strong style="color: #F3CF7A; font-family: monospace; font-size: 15px; letter-spacing: 1px;">${referenceCode}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Hall Name:</td>
                  <td><strong style="color: #FFFFFF;">${hallName}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Event Type:</td>
                  <td style="color: #E2E8F0;">${eventType}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Event Date:</td>
                  <td><strong style="color: #34D399; font-size: 14px;">${eventDate}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Session Slot:</td>
                  <td><strong style="color: #F3CF7A;">${sessionSlot}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Guest Count:</td>
                  <td style="color: #E2E8F0;">${guestCount}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Status:</td>
                  <td><strong style="color: #34D399;">Confirmed</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; vertical-align: top;">Venue Address:</td>
                  <td style="color: #E2E8F0;">${VENUE_LOCATION}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="background-color: #081220; border-left: 3px solid #C99A43; padding: 14px 18px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; font-size: 12px; color: #CBD5E1; line-height: 1.6;">
            <strong>Venue Highlights:</strong> Dedicated parking capacity for up to 50 vehicles, dedicated separate dining hall facilities (Pure Veg Satvik kitchen &amp; Non-Veg banquet space), lift accessibility, and round-the-clock facility assistance.
          </p>
        </div>

        <p style="font-size: 14px; margin: 0 0 8px; color: #FFF9EE; line-height: 1.6;">
          Please retain this confirmation and your Reference ID for your records. For event planning or timing adjustments, our administration team is at your service.
        </p>

        <p style="font-size: 14px; margin: 20px 0 0; color: #F3CF7A; font-style: italic;">
          Warm regards,<br>
          <strong style="color: #FFF9EE; font-style: normal;">Management &amp; Administration</strong><br>
          Buntara Bhavana – Guruvayankere
        </p>
      `;

      bodyText = [
        `Namaskara ${customerName},`,
        '',
        `We are pleased to confirm that your booking request for ${eventType} at Buntara Bhavana, Guruvayanakere has been approved.`,
        '',
        `BOOKING DETAILS:`,
        `- Customer Name: ${customerName}`,
        `- Reference ID: ${referenceCode}`,
        `- Hall Name: ${hallName}`,
        `- Event Type: ${eventType}`,
        `- Event Date: ${eventDate}`,
        `- Session: ${sessionSlot}`,
        `- Guest Count: ${guestCount}`,
        `- Status: Confirmed`,
        `- Venue Address: ${VENUE_LOCATION}`,
        '',
        `VENUE HIGHLIGHTS & AMENITIES:`,
        `- Dedicated on-site parking for up to 50 vehicles.`,
        `- Separate pure veg and non-veg dining facilities.`,
        `- Lift accessibility and ramps for guests.`,
        `- 24/7 facility assistance.`,
        '',
        `VENUE CONTACT & LOCATION:`,
        `${VENUE_PLUS_CODE}, ${VENUE_LOCATION}`,
        `Helpdesk: ${VENUE_PHONE} (${VENUE_HOURS})`,
        `Google Maps: ${MAPS_URL}`,
        '',
        `Please retain this confirmation and your Reference ID for your records.`,
        '',
        `Warm regards,`,
        `Management & Administration`,
        `Buntara Bhavana – Guruvayankere`
      ].join('\n');
    } else if (action === 'cancelled') {
      subject = 'Booking Cancellation Notice - Buntara Bhavana, Guruvayanakere';

      contentHtml = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.15); color: #F87171; border: 1.5px solid #EF4444; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
            BOOKING CANCELLED
          </span>
        </div>

        <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
          Dear <strong style="color: #F3CF7A;">${customerName}</strong>,
        </p>

        <p style="font-size: 14px; margin: 0 0 20px; color: #E2E8F0; line-height: 1.7;">
          Please be advised that your booking for <strong>${hallName}</strong> on <strong>${eventDate}</strong> (${sessionSlot}) has been cancelled by the venue administration.
        </p>

        <table role="presentation" width="100%" style="background-color: #112239; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 18px 22px;">
              <h3 style="margin: 0 0 12px; color: #F87171; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid rgba(239, 68, 68, 0.3); padding-bottom: 6px;">
                Cancelled Booking Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="5" border="0" style="color: #FFF9EE; font-size: 13px;">
                <tr>
                  <td width="38%" style="color: #94A3B8;">Customer Name:</td>
                  <td width="62%"><strong style="color: #FFFFFF;">${customerName}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Reference ID:</td>
                  <td><strong style="color: #F3CF7A; font-family: monospace;">${referenceCode}</strong></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Hall Name:</td>
                  <td style="color: #E2E8F0;">${hallName}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Event Type:</td>
                  <td style="color: #E2E8F0;">${eventType}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Event Date:</td>
                  <td style="color: #E2E8F0;">${eventDate}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Session:</td>
                  <td style="color: #E2E8F0;">${sessionSlot}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Guest Count:</td>
                  <td style="color: #E2E8F0;">${guestCount}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Status:</td>
                  <td><strong style="color: #F87171;">Cancelled (Slot Released)</strong></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="background-color: #081220; border-left: 3px solid #EF4444; padding: 14px 18px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; font-size: 13px; color: #CBD5E1; line-height: 1.6;">
            The reserved date and session slot have been released. If this cancellation was processed in error, or if you would like to reschedule for an alternative date, please reach our support team immediately at <strong style="color: #F3CF7A;">${VENUE_PHONE}</strong> (${VENUE_HOURS}).
          </p>
        </div>

        <p style="font-size: 14px; margin: 20px 0 0; color: #F3CF7A; font-style: italic;">
          Sincerely,<br>
          <strong style="color: #FFF9EE; font-style: normal;">Management &amp; Administration</strong><br>
          Buntara Bhavana – Guruvayankere
        </p>
      `;

      bodyText = [
        `Dear ${customerName},`,
        '',
        `Please be advised that your booking (${referenceCode}) for ${hallName} on ${eventDate} (${sessionSlot}) has been cancelled by the venue administration.`,
        '',
        `CANCELLED BOOKING DETAILS:`,
        `- Customer Name: ${customerName}`,
        `- Reference ID: ${referenceCode}`,
        `- Hall Name: ${hallName}`,
        `- Event Type: ${eventType}`,
        `- Event Date: ${eventDate}`,
        `- Session: ${sessionSlot}`,
        `- Guest Count: ${guestCount}`,
        `- Status: Cancelled (Slot Released)`,
        `- Venue: ${VENUE_NAME}, ${VENUE_LOCATION}`,
        '',
        `The reserved date and session slot have been released. If this cancellation was processed in error, or if you would like to reschedule for an alternative date, please contact our support desk directly at ${VENUE_PHONE} (${VENUE_HOURS}).`,
        '',
        `VENUE CONTACT & LOCATION:`,
        `${VENUE_PLUS_CODE}, ${VENUE_LOCATION}`,
        `Helpdesk: ${VENUE_PHONE} (${VENUE_HOURS})`,
        `Google Maps: ${MAPS_URL}`,
        '',
        `Sincerely,`,
        `Management & Administration`,
        `Buntara Bhavana – Guruvayankere`
      ].join('\n');
    } else {
      subject = eventDate
        ? `Booking Enquiry Update - Buntara Bhavana, Guruvayanakere (${eventDate})`
        : 'Booking Enquiry Update - Buntara Bhavana, Guruvayanakere';

      contentHtml = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.15); color: #F87171; border: 1.5px solid #EF4444; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
            BOOKING ENQUIRY UPDATE
          </span>
        </div>

        <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
          Dear <strong style="color: #F3CF7A;">${customerName}</strong>,
        </p>

        <p style="font-size: 14px; margin: 0 0 20px; color: #E2E8F0; line-height: 1.7;">
          Thank you for your interest in hosting your celebration at <strong>Buntara Bhavana – Guruvayankere</strong>.
        </p>

        <p style="font-size: 14px; margin: 0 0 24px; color: #E2E8F0; line-height: 1.7;">
          We regret to inform you that we are unable to accommodate your booking enquiry for <strong>${hallName}</strong> on <strong>${eventDate}</strong> (${sessionSlot}) due to scheduling or maintenance constraints.
        </p>

        <table role="presentation" width="100%" style="background-color: #112239; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 16px 20px; font-size: 13px; color: #CBD5E1;">
              <p style="margin: 0 0 6px;"><strong>Customer Name:</strong> ${customerName}</p>
              <p style="margin: 0 0 6px;"><strong>Reference ID:</strong> <span style="font-family: monospace; color: #F3CF7A;">${referenceCode}</span></p>
              <p style="margin: 0 0 6px;"><strong>Requested Hall:</strong> ${hallName}</p>
              <p style="margin: 0 0 6px;"><strong>Requested Date:</strong> ${eventDate} (${sessionSlot})</p>
              <p style="margin: 0; color: #F87171;"><strong>Status:</strong> Unable to accommodate</p>
            </td>
          </tr>
        </table>

        <div style="background-color: #081220; border-left: 3px solid #C99A43; padding: 14px 18px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; font-size: 13px; color: #E2E8F0; line-height: 1.6;">
            If your dates are flexible or if you would like to explore alternative open dates or our other spaces (e.g. Kaashi Shetty Vedike or Malady Tunga Vedike), please contact our office directly at <strong style="color: #F3CF7A;">${VENUE_PHONE}</strong> (${VENUE_HOURS}) or check open dates on our website.
          </p>
        </div>

        <p style="font-size: 14px; margin: 20px 0 0; color: #F3CF7A; font-style: italic;">
          Sincerely,<br>
          <strong style="color: #FFF9EE; font-style: normal;">Management &amp; Administration</strong><br>
          Buntara Bhavana – Guruvayankere
        </p>
      `;

      bodyText = [
        `Dear ${customerName},`,
        '',
        `Thank you for your interest in hosting your celebration at Buntara Bhavana – Guruvayankere.`,
        '',
        `We regret to inform you that your booking enquiry (${referenceCode}) for ${hallName} on ${eventDate} (${sessionSlot}) could not be accommodated at this time due to scheduling or maintenance constraints.`,
        '',
        `BOOKING ENQUIRY DETAILS:`,
        `- Customer Name: ${customerName}`,
        `- Reference ID: ${referenceCode}`,
        `- Requested Hall: ${hallName}`,
        `- Requested Date: ${eventDate} (${sessionSlot})`,
        `- Status: Unable to accommodate`,
        '',
        `If your dates are flexible or if you would like to explore alternative open dates or spaces, please feel free to contact our office directly at ${VENUE_PHONE} (${VENUE_HOURS}) or visit our website to explore open slots.`,
        '',
        `VENUE CONTACT & LOCATION:`,
        `${VENUE_PLUS_CODE}, ${VENUE_LOCATION}`,
        `Helpdesk: ${VENUE_PHONE} (${VENUE_HOURS})`,
        `Google Maps: ${MAPS_URL}`,
        '',
        `Sincerely,`,
        `Management & Administration`,
        `Buntara Bhavana – Guruvayankere`
      ].join('\n');
    }

    const html = baseEmailWrapper(contentHtml);

    // 7. Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const fromAddress = `"Buntara Bhavana, Guruvayanakere" <${Deno.env.get('GMAIL_USER') || gmailUser}>`;
    const replyToAddress = Deno.env.get('GMAIL_USER') || gmailUser;

    // Verify SMTP connection and credentials inside a try/catch before attempting delivery
    console.log(`[Edge Function Nodemailer] Verifying Gmail SMTP credentials for ${gmailUser}...`);
    try {
      await transporter.verify();
    } catch (verifyErr: unknown) {
      const verifyMsg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
      console.error('[Edge Function Nodemailer Verify Error]:', verifyMsg);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Gmail SMTP authentication failed: ${verifyMsg}`,
          recipient: customerEmail || 'Unknown'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Edge Function Nodemailer Dispatch] Sending "${subject}" strictly to customer recipient "${customerEmail}" from "${fromAddress}" (reply-to: "${replyToAddress}") via Gmail SMTP...`);
    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: replyToAddress,
      to: customerEmail,
      subject,
      text: bodyText,
      html,
    });

    if (!info || !info.messageId) {
      throw new Error('Gmail SMTP sendMail did not return a valid messageId.');
    }

    console.log(`[Edge Function Nodemailer Success] Email delivered. messageId: ${info.messageId} to ${customerEmail}`);
    return new Response(
      JSON.stringify({
        success: true,
        recipient: customerEmail,
        messageId: info.messageId,
        id: info.messageId,
        subject,
        message: `Confirmation email sent to ${customerEmail}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Edge Function SMTP Exception]', errorMsg);
    return new Response(
      JSON.stringify({
        success: false,
        recipient: customerEmail || 'Unknown',
        error: errorMsg
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
