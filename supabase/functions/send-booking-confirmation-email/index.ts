import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character] || character);

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return jsonResponse(401, { error: 'Sign-in is required.' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Buntara Bhavana <onboarding@resend.dev>';
  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey || !resendApiKey) {
    return jsonResponse(500, { error: 'Email service is not configured. Contact the site administrator.' });
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse(401, { error: 'Sign-in could not be verified.' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role, is_active')
    .eq('id', userData.user.id)
    .maybeSingle();
  if (profileError) {
    return jsonResponse(500, { error: 'Could not verify account permissions.' });
  }
  if (!profile || !profile.is_active) {
    return jsonResponse(403, { error: 'An active account is required.' });
  }
  const isAdmin = profile.role === 'admin';

  let bookingId: unknown;
  try {
    ({ booking_id: bookingId } = await request.json());
  } catch {
    return jsonResponse(400, { error: 'A valid booking ID is required.' });
  }
  if (typeof bookingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(bookingId)) {
    return jsonResponse(400, { error: 'A valid booking ID is required.' });
  }

  const { data: booking, error: bookingError } = await adminClient
    .from('booking_enquiries')
    .select('profile_id, reference_code, customer_name, email_address, hall_name, event_date, session, status')
    .eq('id', bookingId)
    .maybeSingle();
  if (bookingError) {
    return jsonResponse(500, { error: 'Could not load the booking details.' });
  }
  if (!booking || booking.status !== 'approved') {
    return jsonResponse(409, { error: 'Only a confirmed booking can receive a confirmation email.' });
  }
  if (!isAdmin && booking.profile_id !== userData.user.id) {
    return jsonResponse(403, { error: 'You can only send a confirmation for your own booking.' });
  }

  let recipientEmail = booking.email_address;
  if (booking.profile_id) {
    const { data: customerData, error: customerError } = await adminClient.auth.admin
      .getUserById(booking.profile_id);
    if (customerError) {
      return jsonResponse(500, { error: 'Could not load the registered customer email.' });
    }
    if (!customerData.user?.email) {
      return jsonResponse(400, { error: 'The registered customer does not have an email address.' });
    }
    recipientEmail = customerData.user.email;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return jsonResponse(400, { error: 'The booking does not have a valid customer email address.' });
  }

  const greetingName = escapeHtml(booking.customer_name);
  const hallName = escapeHtml(booking.hall_name);
  const session = escapeHtml(booking.session);
  const referenceCode = escapeHtml(booking.reference_code);
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipientEmail],
      subject: `Booking confirmed - ${booking.reference_code}`,
      text: [
        `Hello ${booking.customer_name},`,
        '',
        'Your booking is confirmed.',
        `Reference: ${booking.reference_code}`,
        `Hall: ${booking.hall_name}`,
        `Date: ${booking.event_date}`,
        `Session: ${booking.session}`,
        '',
        'Thank you,',
        'Buntara Bhavana'
      ].join('\n'),
      html: `<p>Hello ${greetingName},</p><p>Your booking is confirmed.</p><ul><li><strong>Reference:</strong> ${referenceCode}</li><li><strong>Hall:</strong> ${hallName}</li><li><strong>Date:</strong> ${escapeHtml(booking.event_date)}</li><li><strong>Session:</strong> ${session}</li></ul><p>Thank you,<br>Buntara Bhavana</p>`
    })
  });
  if (!emailResponse.ok) {
    return jsonResponse(502, { error: 'The email provider could not deliver the confirmation email. You can retry from the admin dashboard.' });
  }

  return jsonResponse(200, { message: 'Booking confirmation email sent.', sent_to: recipientEmail });
});
