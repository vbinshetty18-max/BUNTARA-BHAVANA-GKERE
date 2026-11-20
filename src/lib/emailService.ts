import { supabase } from './supabase';

export type BookingActionType = 'approved' | 'rejected' | 'cancelled';

export interface BookingNotificationPayload {
  bookingId: string;
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  hallName: string;
  hallCategory?: string;
  eventDate: string;
  sessionSlot: string;
  eventType: string;
  rentalPrice?: string;
  adminNote?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  method: 'edge_function';
  recipient: string;
  subject: string;
  previewText: string;
  message: string;
  error?: string;
}

const VENUE_PHONE = '+91 8256 232 456';
const VENUE_LOCATION = 'Buntara Bhavana, Guruvayanakere, Belthangady, Karnataka 574217';

/**
 * Generates subject and body content for Buntara Bhavana booking notifications
 */
export function generateBookingEmailContent(
  payload: BookingNotificationPayload,
  action: BookingActionType
): { subject: string; bodyText: string; bodyHtml: string } {
  const {
    referenceCode,
    customerName,
    hallName,
    eventDate,
    sessionSlot,
    eventType
  } = payload;

  if (action === 'approved') {
    const subject = eventDate
      ? `Booking Confirmed - Buntara Bhavana, Guruvayanakere (${eventDate})`
      : 'Booking Confirmed - Buntara Bhavana, Guruvayanakere';
    const bodyText = [
      `Namaskara ${customerName},`,
      '',
      `We are pleased to confirm that your booking request for ${eventType || 'your event'} at Buntara Bhavana has been approved!`,
      '',
      `BOOKING CONFIRMATION DETAILS:`,
      `• Reference Code: ${referenceCode}`,
      `• Hall / Space: ${hallName}`,
      `• Event Date: ${eventDate}`,
      `• Time Slot: ${sessionSlot}`,
      `• Event Occasion: ${eventType || 'Event'}`,
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

    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0B192C; color: #FFF9EE; padding: 24px; text-align: center; border-bottom: 3px solid #C99A43;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 2px;">BUNTARA BHAVANA</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #C99A43; text-transform: uppercase;">Guruvayankere • Heritage Celebration Venue</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; font-weight: bold; color: #047857; margin-top: 0;">✓ Booking Confirmed</p>
          <p>Namaskara <strong>${customerName}</strong>,</p>
          <p>We are delighted to confirm your booking for <strong>${eventType || 'Celebration'}</strong> at Buntara Bhavana.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #C99A43; padding: 14px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>Reference Code:</strong> ${referenceCode}</p>
            <p style="margin: 4px 0;"><strong>Venue / Hall:</strong> ${hallName}</p>
            <p style="margin: 4px 0;"><strong>Event Date:</strong> ${eventDate}</p>
            <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${sessionSlot}</p>
            <p style="margin: 4px 0;"><strong>Venue Address:</strong> ${VENUE_LOCATION}</p>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
            Contact: ${VENUE_PHONE} (9:30 AM – 6:00 PM)
          </p>
          <p style="margin-top: 24px;">We look forward to honoring your special milestone with grace and tradition.<br/><strong>Buntara Bhavana Administration</strong></p>
        </div>
      </div>
    `;

    return { subject, bodyText, bodyHtml };
  }

  if (action === 'cancelled') {
    const subject = 'Booking Cancellation Notice - Buntara Bhavana, Guruvayanakere';
    const bodyText = [
      `Dear ${customerName},`,
      '',
      `Please be advised that your booking (${referenceCode}) for ${hallName} on ${eventDate} (${sessionSlot}) has been cancelled by the venue administration.`,
      '',
      `CANCELLATION SUMMARY:`,
      `• Reference Code: ${referenceCode}`,
      `• Hall: ${hallName}`,
      `• Scheduled Date: ${eventDate}`,
      `• Time Slot: ${sessionSlot}`,
      `• Status: Cancelled (Date & Slot Released)`,
      `• Venue: ${VENUE_LOCATION}`,
      '',
      `The reserved date and time slot have been released. If you wish to reschedule for an alternate date or have any questions, please contact our support desk directly at ${VENUE_PHONE} (9:30 AM – 6:00 PM).`,
      '',
      `Sincerely,`,
      `Management & Administration`,
      `Buntara Bhavana – Guruvayankere`
    ].join('\n');

    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0B192C; color: #FFF9EE; padding: 24px; text-align: center; border-bottom: 3px solid #b91c1c;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 2px;">BUNTARA BHAVANA</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #F87171; text-transform: uppercase;">Guruvayankere</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; font-weight: bold; color: #b91c1c; margin-top: 0;">Booking Cancellation Notice</p>
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>Your booking for <strong>${hallName}</strong> has been cancelled by venue management.</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>Reference:</strong> ${referenceCode}</p>
            <p style="margin: 4px 0;"><strong>Hall:</strong> ${hallName}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${eventDate}</p>
            <p style="margin: 4px 0;"><strong>Session:</strong> ${sessionSlot}</p>
            <p style="margin: 4px 0; color: #b91c1c;"><strong>Status:</strong> Cancelled (Slot Released)</p>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
            The date and slot have been freed up. For queries or rescheduling, contact ${VENUE_PHONE}.
          </p>
          <p style="margin-top: 24px;"><strong>Buntara Bhavana Administration</strong></p>
        </div>
      </div>
    `;

    return { subject, bodyText, bodyHtml };
  }

  // Default: Rejected
  const subject = 'Booking Update - Buntara Bhavana, Guruvayanakere';
  const bodyText = [
    `Dear ${customerName},`,
    '',
    `Thank you for your interest in hosting your celebration at Buntara Bhavana – Guruvayankere.`,
    '',
    `We regret to inform you that your booking enquiry (${referenceCode}) for ${hallName} on ${eventDate} (${sessionSlot}) could not be accommodated at this time due to scheduling or maintenance constraints.`,
    '',
    `If you would like to discuss alternative available dates or spaces, please feel free to contact our office directly at ${VENUE_PHONE} or visit our website to explore open slots.`,
    '',
    `Sincerely,`,
    `Management & Administration`,
    `Buntara Bhavana – Guruvayankere`
  ].join('\n');

  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0B192C; color: #FFF9EE; padding: 24px; text-align: center; border-bottom: 3px solid #C99A43;">
        <h2 style="margin: 0; font-size: 20px; letter-spacing: 2px;">BUNTARA BHAVANA</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #C99A43; text-transform: uppercase;">Guruvayankere</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 16px; font-weight: bold; color: #b91c1c; margin-top: 0;">Booking Enquiry Update</p>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Thank you for your enquiry for <strong>${hallName}</strong> on <strong>${eventDate}</strong> (${sessionSlot}).</p>
        <p>Regrettably, we are unable to accept this booking request due to scheduling constraints.</p>
        <p style="font-size: 13px; color: #64748b;">
          Please feel free to check other available dates or contact us at ${VENUE_PHONE}.
        </p>
        <p style="margin-top: 24px;"><strong>Buntara Bhavana Administration</strong></p>
      </div>
    </div>
  `;

  return { subject, bodyText, bodyHtml };
}

/**
 * Dispatches an automated email notification by directly invoking the Supabase Edge Function 'send-booking-email'.
 * Uses the RESEND_API_KEY secret configured in Supabase Edge Function Secrets.
 */
export async function sendBookingNotificationEmail(
  payload: BookingNotificationPayload,
  action: BookingActionType
): Promise<EmailDispatchResult> {
  const recipientEmail = (payload.customerEmail || '').trim();
  const { subject, bodyText } = generateBookingEmailContent(payload, action);

  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return {
      success: false,
      method: 'edge_function',
      recipient: recipientEmail || 'None',
      subject,
      previewText: bodyText,
      message: 'No valid customer email address was provided with this booking.'
    };
  }

  const bookingData = {
    referenceCode: payload.referenceCode,
    customerName: payload.customerName,
    customerEmail: recipientEmail,
    customerPhone: payload.customerPhone || '',
    hallName: payload.hallName,
    eventDate: payload.eventDate,
    sessionSlot: payload.sessionSlot,
    eventType: payload.eventType || '',
    rentalPrice: payload.rentalPrice || ''
  };

  if (!supabase) {
    return {
      success: false,
      method: 'edge_function',
      recipient: recipientEmail,
      subject,
      previewText: bodyText,
      message: 'Supabase client is not initialized.'
    };
  }

  try {
    console.log(`[Supabase Edge Function] Invoking send-booking-email for ${recipientEmail} (${action})...`);
    
    const { data, error } = await supabase.functions.invoke('send-booking-email', {
      body: {
        bookingId: payload.bookingId,
        booking_id: payload.bookingId,
        status: action,
        action,
        to: recipientEmail,
        customer_email: recipientEmail,
        email: recipientEmail,
        booking: bookingData
      }
    });

    if (error) {
      console.error('[Supabase Edge Function Invoke Error]', error);
      let backendErrorMessage = error.message;

      // Extract exact backend error from the Response context if available
      try {
        if (error.context && typeof error.context.json === 'function') {
          const errBody = await error.context.json();
          if (errBody?.error) {
            backendErrorMessage = errBody.error;
          }
        }
      } catch {
        try {
          if (error.context && typeof error.context.text === 'function') {
            const errText = await error.context.text();
            if (errText) backendErrorMessage = errText;
          }
        } catch {}
      }

      const is404 = String(backendErrorMessage || '').includes('404') || (error as { context?: { status?: number } })?.context?.status === 404;
      const errorMsg = is404
        ? 'Edge Function "send-booking-email" returned 404 (Not Deployed). Run `npx supabase functions deploy send-booking-email --project-ref mmmaheyictnnmjnbvtrj --no-verify-jwt` to deploy.'
        : backendErrorMessage;

      return {
        success: false,
        method: 'edge_function',
        recipient: recipientEmail,
        subject,
        previewText: bodyText,
        message: errorMsg,
        error: errorMsg
      };
    }

    if (data?.success) {
      const deliveredTo = data.recipient || recipientEmail;
      return {
        success: true,
        method: 'edge_function',
        recipient: deliveredTo,
        subject: data.subject || subject,
        previewText: bodyText,
        message: `Confirmation email sent to ${deliveredTo}`
      };
    } else {
      console.warn('[Supabase Edge Function Returned Error]', data?.error);
      const errorMsg = data?.error || 'Supabase Edge Function reported an error while dispatching email.';
      return {
        success: false,
        method: 'edge_function',
        recipient: recipientEmail,
        subject,
        previewText: bodyText,
        message: errorMsg,
        error: errorMsg
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Supabase Edge Function Exception]', errorMsg);
    return {
      success: false,
      method: 'edge_function',
      recipient: recipientEmail,
      subject,
      previewText: bodyText,
      message: `Failed to invoke Edge Function: ${errorMsg}`,
      error: errorMsg
    };
  }
}
