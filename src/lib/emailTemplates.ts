export interface BookingEmailData {
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  hallName: string;
  eventDate: string;
  sessionSlot: string;
  eventType: string;
  rentalPrice?: string;
}

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
<body style="margin: 0; padding: 0; background-color: #050C16; font-family: 'Georgia', 'Times New Roman', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial; -webkit-font-smoothing: antialiased;">
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
                    <!-- Traditional Lamp / Emblem Motif in Gold -->
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

/**
 * 1. Approved / Confirmed Email Template
 * Subject: "Booking Confirmed - Buntara Bhavana, Guruvayanakere"
 */
export function getApprovedEmailTemplate(booking: BookingEmailData): { subject: string; html: string; text: string } {
  const subject = 'Booking Confirmed - Buntara Bhavana, Guruvayanakere';

  const contentHtml = `
    <!-- Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #34D399; border: 1.5px solid #10B981; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
        ✓ BOOKING CONFIRMED
      </span>
    </div>

    <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
      Namaskara <strong style="color: #F3CF7A;">${booking.customerName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 24px; color: #E2E8F0; line-height: 1.7;">
      We are delighted to confirm that your booking request for <strong>${booking.eventType}</strong> has been officially approved by the Buntara Bhavana administration. We are honored to host your auspicious celebration.
    </p>

    <!-- Booking Details Box -->
    <table role="presentation" width="100%" style="background-color: #112239; border: 1.5px solid #C99A43; border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 20px 22px;">
          <h3 style="margin: 0 0 14px; color: #F3CF7A; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid rgba(201, 154, 67, 0.3); padding-bottom: 8px;">
            Booking Summary
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="color: #FFF9EE; font-size: 13px;">
            <tr>
              <td width="38%" style="color: #94A3B8; vertical-align: top;">Reference Code:</td>
              <td width="62%"><strong style="color: #F3CF7A; font-family: monospace; font-size: 15px; letter-spacing: 1px;">${booking.referenceCode}</strong></td>
            </tr>
            <tr>
              <td style="color: #94A3B8; vertical-align: top;">Selected Hall / Vedike:</td>
              <td><strong style="color: #FFFFFF;">${booking.hallName}</strong></td>
            </tr>
            <tr>
              <td style="color: #94A3B8; vertical-align: top;">Event Occasion:</td>
              <td style="color: #E2E8F0;">${booking.eventType}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8; vertical-align: top;">Auspicious Event Date:</td>
              <td><strong style="color: #34D399; font-size: 14px;">📅 ${booking.eventDate}</strong></td>
            </tr>
            <tr>
              <td style="color: #94A3B8; vertical-align: top;">Reserved Time Slot:</td>
              <td><strong style="color: #F3CF7A;">⏰ ${booking.sessionSlot}</strong></td>
            </tr>
            <tr>
              <td style="color: #94A3B8; vertical-align: top;">Venue Address:</td>
              <td style="color: #E2E8F0;">${VENUE_LOCATION}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Highlights & Guidelines -->
    <div style="background-color: #081220; border-left: 3px solid #C99A43; padding: 14px 18px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 12px; color: #CBD5E1; line-height: 1.6;">
        ✨ <strong>Venue Highlights:</strong> Dedicated parking capacity for up to 50 vehicles, dedicated separate dining hall facilities (Pure Veg Satvik kitchen &amp; Non-Veg banquet space), lift accessibility, and round-the-clock facility assistance.
      </p>
    </div>

    <p style="font-size: 14px; margin: 0 0 8px; color: #FFF9EE; line-height: 1.6;">
      Please retain this confirmation and your Reference Code for your records. For event planning or timing adjustments, our administration team is at your service.
    </p>

    <p style="font-size: 14px; margin: 20px 0 0; color: #F3CF7A; font-style: italic;">
      Warm regards,<br>
      <strong style="color: #FFF9EE; font-style: normal;">Management &amp; Administration</strong><br>
      Buntara Bhavana – Guruvayankere
    </p>
  `;

  const text = [
    `Namaskara ${booking.customerName},`,
    '',
    `We are pleased to confirm that your booking request for ${booking.eventType} at Buntara Bhavana has been approved!`,
    '',
    `BOOKING CONFIRMATION DETAILS:`,
    `• Reference Code: ${booking.referenceCode}`,
    `• Hall / Space: ${booking.hallName}`,
    `• Event Date: ${booking.eventDate}`,
    `• Time Slot: ${booking.sessionSlot}`,
    `• Event Occasion: ${booking.eventType}`,
    `• Venue Address: ${VENUE_LOCATION}`,
    '',
    `VENUE AMENITIES:`,
    `• Dedicated on-site parking for up to 50 vehicles.`,
    `• Separate pure veg and non-veg dining facilities.`,
    `• Lift and accessibility ramps for guests.`,
    '',
    `For any questions or coordination, call our office at ${VENUE_PHONE} (9:30 AM – 6:00 PM).`,
    '',
    `Thank you,`,
    `Management & Administration`,
    `Buntara Bhavana – Guruvayankere`
  ].join('\n');

  return { subject, html: baseEmailWrapper(contentHtml), text };
}

/**
 * 2. Rejected Email Template
 * Subject: "Booking Update - Buntara Bhavana, Guruvayanakere"
 */
export function getRejectedEmailTemplate(booking: BookingEmailData): { subject: string; html: string; text: string } {
  const subject = 'Booking Update - Buntara Bhavana, Guruvayanakere';

  const contentHtml = `
    <!-- Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.15); color: #F87171; border: 1.5px solid #EF4444; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
        BOOKING ENQUIRY UPDATE
      </span>
    </div>

    <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
      Dear <strong style="color: #F3CF7A;">${booking.customerName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px; color: #E2E8F0; line-height: 1.7;">
      Thank you for your interest in hosting your celebration at <strong>Buntara Bhavana – Guruvayankere</strong>.
    </p>

    <p style="font-size: 14px; margin: 0 0 24px; color: #E2E8F0; line-height: 1.7;">
      We regret to inform you that we are unable to accommodate your booking enquiry for <strong>${booking.hallName}</strong> on <strong>${booking.eventDate}</strong> (${booking.sessionSlot}) due to scheduling or maintenance constraints.
    </p>

    <!-- Details Box -->
    <table role="presentation" width="100%" style="background-color: #112239; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 16px 20px; font-size: 13px; color: #CBD5E1;">
          <p style="margin: 0 0 6px;"><strong>Reference:</strong> <span style="font-family: monospace; color: #F3CF7A;">${booking.referenceCode}</span></p>
          <p style="margin: 0 0 6px;"><strong>Requested Hall:</strong> ${booking.hallName}</p>
          <p style="margin: 0 0 6px;"><strong>Requested Date:</strong> ${booking.eventDate} (${booking.sessionSlot})</p>
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

  const text = [
    `Dear ${booking.customerName},`,
    '',
    `Thank you for your interest in hosting your celebration at Buntara Bhavana – Guruvayankere.`,
    '',
    `We regret to inform you that your booking enquiry (${booking.referenceCode}) for ${booking.hallName} on ${booking.eventDate} (${booking.sessionSlot}) could not be accommodated at this time due to scheduling or maintenance constraints.`,
    '',
    `If you would like to discuss alternative available dates or spaces, please feel free to contact our office directly at ${VENUE_PHONE} or visit our website to explore open slots.`,
    '',
    `Sincerely,`,
    `Management & Administration`,
    `Buntara Bhavana – Guruvayankere`
  ].join('\n');

  return { subject, html: baseEmailWrapper(contentHtml), text };
}

/**
 * 3. Cancelled (by Management) Email Template
 * Subject: "Booking Cancellation Notice - Buntara Bhavana, Guruvayanakere"
 */
export function getCancelledEmailTemplate(booking: BookingEmailData): { subject: string; html: string; text: string } {
  const subject = 'Booking Cancellation Notice - Buntara Bhavana, Guruvayanakere';

  const contentHtml = `
    <!-- Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.15); color: #F87171; border: 1.5px solid #EF4444; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
        ✕ BOOKING CANCELLED
      </span>
    </div>

    <p style="font-size: 16px; margin: 0 0 16px; color: #FFF9EE; line-height: 1.6;">
      Dear <strong style="color: #F3CF7A;">${booking.customerName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px; color: #E2E8F0; line-height: 1.7;">
      Please be advised that your booking for <strong>${booking.hallName}</strong> on <strong>${booking.eventDate}</strong> (${booking.sessionSlot}) has been cancelled by the venue administration.
    </p>

    <!-- Cancellation Summary Box -->
    <table role="presentation" width="100%" style="background-color: #112239; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 18px 22px;">
          <h3 style="margin: 0 0 12px; color: #F87171; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid rgba(239, 68, 68, 0.3); padding-bottom: 6px;">
            Cancelled Booking Details
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="5" border="0" style="color: #FFF9EE; font-size: 13px;">
            <tr>
              <td width="38%" style="color: #94A3B8;">Reference Code:</td>
              <td width="62%"><strong style="color: #F3CF7A; font-family: monospace;">${booking.referenceCode}</strong></td>
            </tr>
            <tr>
              <td style="color: #94A3B8;">Hall / Space:</td>
              <td style="color: #E2E8F0;">${booking.hallName}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8;">Original Date:</td>
              <td style="color: #E2E8F0;">${booking.eventDate}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8;">Session Slot:</td>
              <td style="color: #E2E8F0;">${booking.sessionSlot}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8;">Current Status:</td>
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

  const text = [
    `Dear ${booking.customerName},`,
    '',
    `Please be advised that your booking (${booking.referenceCode}) for ${booking.hallName} on ${booking.eventDate} (${booking.sessionSlot}) has been cancelled by the venue administration.`,
    '',
    `CANCELLATION SUMMARY:`,
    `• Reference Code: ${booking.referenceCode}`,
    `• Hall: ${booking.hallName}`,
    `• Scheduled Date: ${booking.eventDate}`,
    `• Time Slot: ${booking.sessionSlot}`,
    `• Status: Cancelled (Date & Slot Released)`,
    `• Venue: ${VENUE_NAME}, ${VENUE_LOCATION}`,
    '',
    `The reserved date and time slot have been released. If you wish to reschedule for an alternate date or have any questions, please contact our support desk directly at ${VENUE_PHONE} (${VENUE_HOURS}).`,
    '',
    `Sincerely,`,
    `Management & Administration`,
    `Buntara Bhavana – Guruvayankere`
  ].join('\n');

  return { subject, html: baseEmailWrapper(contentHtml), text };
}
