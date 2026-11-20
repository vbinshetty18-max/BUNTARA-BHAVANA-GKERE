import { useEffect, useState, useRef, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Trash2, Eye, EyeOff, Plus, LogOut } from 'lucide-react';
import { sendBookingNotificationEmail } from './lib/emailService';

const ADMIN_EMAIL = 'buntarabhavanagkere@gmail.com';
const ADMIN_PASSWORD = 'buntsgkere@1234';
const ADMIN_STORAGE_KEY = 'bb_admin_session';

const ADMIN_SECTIONS = ['Bookings', 'Halls', 'Website content', 'Gallery'];

type Booking = {
  id: string;
  reference_code: string;
  hall_id: string;
  event_type: string;
  hall_name: string;
  event_date: string;
  session: string;
  number_of_guests: number | null;
  profiles?: { full_name: string; email: string; phone: string } | null;
  customer_name: string;
  email_address: string;
  email?: string;
  customer_email?: string;
  mobile_number: string;
  additional_message: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submitted_at: string;
  admin_note: string;
};

type VenueHall = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_active: boolean;
  highlights?: string[];
  suitable_events?: string[];
  suitableEvents?: string[];
  details: {
    highlights?: string[];
    suitableEvents?: string[];
    timings?: { morning?: string; evening?: string; note?: string };
    [key: string]: unknown;
  };
};

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  storage_path: string | null;
};

type SiteEvent = { title: string; desc: string };
type SiteContent = {
  heroImage?: string;
  heroImages?: string[];
  heroKicker: string;
  heroTagline: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutDetails: string;
  hallsTitle: string;
  hallsSubtitle: string;
  facilitiesIntro: string;
  eventsTitle: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  officeHours: string;
  events: SiteEvent[];
  facilities: Array<{ id: string; title: string; subtitle: string; description: string }>;
  [key: string]: unknown;
};

const defaultContent = {
  heroKicker: '',
  heroTagline: '',
  aboutTitle: '',
  aboutIntro: '',
  aboutDetails: '',
  hallsTitle: '',
  hallsSubtitle: '',
  facilitiesIntro: '',
  eventsTitle: '',
  contactAddress: '',
  contactPhone: '',
  contactEmail: 'buntarabhavanagkere@gmail.com',
  officeHours: '',
  events: [],
  facilities: []
};

function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState('Bookings');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);
  const [halls, setHalls] = useState<VenueHall[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadDashboard = async () => {
    if (!supabase) return null;
    setBusy(true);
    setError('');

    const [bookingResult, hallResult, galleryResult, contentResult] =
      await Promise.all([
        supabase.from('booking_enquiries').select('*, profiles(full_name, email, phone)').order('submitted_at', { ascending: false }),
        supabase.from('venue_halls').select('*').order('display_order'),
        supabase.from('gallery_items').select('*').order('display_order'),
        supabase.from('site_content').select('content').eq('id', 'public').maybeSingle()
      ]);

    const failedResult = [bookingResult, hallResult, galleryResult, contentResult]
      .find((result) => result.error);
    if (failedResult?.error) {
      setError(failedResult.error.message);
      setBusy(false);
      return failedResult.error.message;
    }

    setBookings(bookingResult.data || []);
    setHalls(hallResult.data || []);
    setGallery(galleryResult.data || []);
    setContent({ ...defaultContent, ...(contentResult.data?.content || {}) } as SiteContent);
    setBusy(false);
    return null;
  };

  const checkAdmin = async (userId: string) => {
    if (!supabase) return;
    setReady(false);
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !data || data.role !== 'admin' || !data.is_active) {
      if (!localStorage.getItem(ADMIN_STORAGE_KEY) && !sessionStorage.getItem(ADMIN_STORAGE_KEY)) {
        setAuthorized(false);
        setError(profileError?.message || 'This account does not have administrator access.');
        await supabase.auth.signOut();
      }
      setReady(true);
      return;
    }

    setError('');
    setAuthorized(true);
    await loadDashboard();
    setReady(true);
  };

  useEffect(() => {
    // 1. Check local/session storage for existing authenticated admin session
    const storedSession = localStorage.getItem(ADMIN_STORAGE_KEY) || sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedSession) {
      setAuthorized(true);
      setReady(true);
      void loadDashboard();
      return;
    }

    if (!supabase) {
      setReady(true);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      if (data.session) {
        void checkAdmin(data.session.user.id);
      } else {
        setReady(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (nextSession) {
        setReady(false);
        window.setTimeout(() => {
          if (active) void checkAdmin(nextSession.user.id);
        }, 0);
      } else {
        if (!localStorage.getItem(ADMIN_STORAGE_KEY) && !sessionStorage.getItem(ADMIN_STORAGE_KEY)) {
          setAuthorized(false);
        }
        setReady(true);
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    const inputEmail = login.email.trim().toLowerCase();
    const inputPassword = login.password;

    // 1. Primary check: Exact Admin Credentials
    if (inputEmail === ADMIN_EMAIL.toLowerCase() && inputPassword === ADMIN_PASSWORD) {
      const sessionPayload = {
        email: ADMIN_EMAIL,
        role: 'admin',
        authenticatedAt: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
      setAuthorized(true);
      setError('');
      await loadDashboard();
      setBusy(false);
      return;
    }

    // 2. Secondary check: Supabase Auth fallback if provisioned in Supabase
    if (supabase) {
      try {
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: login.email.trim(),
          password: login.password
        });
        if (!loginError && authData.session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_active')
            .eq('id', authData.session.user.id)
            .maybeSingle();

          if (profile && profile.role === 'admin' && profile.is_active) {
            const sessionPayload = {
              email: authData.session.user.email || login.email.trim(),
              role: 'admin',
              authenticatedAt: new Date().toISOString()
            };
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
            sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
            setSession(authData.session);
            setAuthorized(true);
            setError('');
            await loadDashboard();
            setBusy(false);
            return;
          }
        }
      } catch {
        // Fall through to error
      }
    }

    setError('Invalid administrator email or password. Please verify your credentials and try again.');
    setBusy(false);
  };

  const handleLogout = async () => {
    setBusy(true);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setSession(null);
    setAuthorized(false);
    setLogin({ email: '', password: '' });
    setError('');
    setMessage('');
    setBusy(false);
  };

  const decideBooking = async (
    booking: Booking,
    status: 'approved' | 'rejected' | 'cancelled'
  ) => {
    if (!supabase) return;
    setBusy(true);
    setError('');
    setMessage('');

    const targetCustomerEmail = (
      booking.email_address ||
      booking.customer_email ||
      booking.email ||
      booking.profiles?.email ||
      ''
    ).trim();

    // 1. Update status in Supabase: attempt RPC first, then fallback to direct update
    let updateError: { message: string } | null = null;
    const { error: rpcError } = await supabase.rpc('admin_decide_booking', {
      booking_id: booking.id,
      new_status: status,
      decision_note: status === 'cancelled' ? 'Cancelled by administration' : ''
    });

    if (rpcError) {
      // Direct table update fallback
      const { error: directError } = await supabase
        .from('booking_enquiries')
        .update({
          status,
          admin_note: status === 'cancelled' ? 'Cancelled by administration' : ''
        })
        .eq('id', booking.id);

      if (directError) {
        if (status === 'cancelled') {
          // If remote database check constraint only permits ('pending', 'approved', 'rejected')
          const { error: fallbackError } = await supabase
            .from('booking_enquiries')
            .update({
              status: 'rejected',
              admin_note: 'Booking cancelled by administration'
            })
            .eq('id', booking.id);
          updateError = fallbackError;
        } else {
          updateError = directError;
        }
      }
    }

    if (updateError) {
      const errText = `Failed to update booking status: ${updateError.message}`;
      setError(errText);
      setToast({ type: 'error', message: errText });
      setBusy(false);
      return;
    }

    let actionLabel = '';
    if (status === 'approved') {
      actionLabel = `Booking ${booking.reference_code} approved!`;
    } else if (status === 'cancelled') {
      actionLabel = `Booking ${booking.reference_code} cancelled and slot released!`;
    } else {
      actionLabel = `Booking ${booking.reference_code} rejected.`;
    }

    // 2. Automated email dispatch to the exact customer email entered during booking
    if (targetCustomerEmail) {
      const emailResult = await sendBookingNotificationEmail(
        {
          bookingId: booking.id,
          referenceCode: booking.reference_code,
          customerName: booking.customer_name || booking.profiles?.full_name || 'Valued Guest',
          customerEmail: targetCustomerEmail,
          customerPhone: booking.mobile_number || booking.profiles?.phone || '',
          hallName: booking.hall_name,
          eventDate: booking.event_date,
          sessionSlot: booking.session,
          eventType: booking.event_type
        },
        status
      );

      if (emailResult.success) {
        const deliveredRecipient = emailResult.recipient || targetCustomerEmail;
        const successToastMsg = `Confirmation email sent to ${deliveredRecipient}`;
        setMessage(`${actionLabel} ${successToastMsg}`);
        setToast({ type: 'success', message: `${actionLabel} ${successToastMsg}` });
      } else {
        console.warn(`[Edge Function Email Note for ${booking.reference_code}]:`, emailResult.message);
        const failMsg = `Booking updated, but email delivery failed: ${emailResult.message}`;
        setError(failMsg);
        setToast({ type: 'error', message: failMsg });
      }
    } else {
      const noEmailNotice = '(No customer email on record)';
      setMessage(`${actionLabel} ${noEmailNotice}`);
      setToast({ type: 'success', message: `${actionLabel} ${noEmailNotice}` });
    }

    await loadDashboard();
    setBusy(false);
  };

  const handleCancelBooking = async (booking: Booking) => {
    const customerEmail = booking.email_address || booking.customer_email || booking.email || booking.profiles?.email || 'N/A';
    const confirmed = window.confirm(
      `Are you sure you want to cancel the approved booking for "${booking.customer_name}"?\n\n` +
      `• Hall: ${booking.hall_name}\n` +
      `• Date: ${booking.event_date} (${booking.session})\n` +
      `• Reference: ${booking.reference_code}\n\n` +
      `This will mark the booking as Cancelled, free up the date and time slot for new bookings, and send an automated cancellation email to ${customerEmail}.`
    );
    if (!confirmed) return;
    await decideBooking(booking, 'cancelled');
  };

  const allSelected = bookings.length > 0 && selectedBookingIds.length === bookings.length;
  const isIndeterminate = selectedBookingIds.length > 0 && selectedBookingIds.length < bookings.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(bookings.map((b) => b.id));
    }
  };

  const toggleSelectBooking = (id: string) => {
    setSelectedBookingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeDeleteBookings = async (ids: string[]) => {
    if (!supabase || ids.length === 0) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      // Direct table delete via Supabase client with chained .select()
      const { data, error } = await supabase
        .from('booking_enquiries')
        .delete()
        .in('id', ids)
        .select();

      if (error) {
        const errorText = `Failed to delete booking records: ${error.message}`;
        setError(errorText);
        setToast({ type: 'error', message: errorText });
        setBusy(false);
        return;
      }

      // Confirm data.length > 0 before updating local React state
      if (!data || data.length === 0) {
        const rlsError = 'Supabase Row-Level Security (RLS) blocked the deletion (0 rows deleted). Please run the provided SQL migration in the Supabase SQL Editor to grant DELETE permissions to admins.';
        setError(rlsError);
        setToast({ type: 'error', message: rlsError });
        setBusy(false);
        return;
      }

      // Successfully deleted in Supabase -> update local React state
      const deletedIds = data.map((row: { id: string }) => row.id);
      setBookings((prev) => prev.filter((b) => !deletedIds.includes(b.id)));
      setSelectedBookingIds((prev) => prev.filter((id) => !deletedIds.includes(id)));

      const successText = `Successfully deleted ${data.length} booking record${data.length > 1 ? 's' : ''}.`;
      setMessage(successText);
      setToast({ type: 'success', message: successText });
      await loadDashboard();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Error deleting booking: ${errorMsg}`);
      setToast({ type: 'error', message: `Error deleting booking: ${errorMsg}` });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    const customerName = booking.customer_name || booking.profiles?.full_name || 'Guest Customer';
    const confirmMessage =
      `Are you sure you want to permanently delete this booking enquiry?\n\n` +
      `• Customer: ${customerName}\n` +
      `• Hall: ${booking.hall_name}\n` +
      `• Date: ${booking.event_date} (${booking.session})\n` +
      `• Reference: ${booking.reference_code}\n\n` +
      `This will permanently remove the record from the database and free up any locked slots. This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;
    await executeDeleteBookings([booking.id]);
  };

  const handleDeleteSelected = async () => {
    if (selectedBookingIds.length === 0) return;
    const count = selectedBookingIds.length;
    const confirmMessage =
      `Are you sure you want to permanently delete the ${count} selected booking record${count > 1 ? 's' : ''}?\n\n` +
      `This will permanently remove them from the database and free up any locked slots. This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;
    await executeDeleteBookings(selectedBookingIds);
  };

  const resendNotificationEmail = async (booking: Booking, type: 'approved' | 'cancelled') => {
    const targetEmail = (
      booking.email_address ||
      booking.customer_email ||
      booking.email ||
      booking.profiles?.email ||
      ''
    ).trim();
    if (!targetEmail) {
      const errText = 'Cannot send email: No customer email address was provided with this booking.';
      setError(errText);
      setToast({ type: 'error', message: errText });
      return;
    }
    setBusy(true);
    setError('');
    const emailResult = await sendBookingNotificationEmail(
      {
        bookingId: booking.id,
        referenceCode: booking.reference_code,
        customerName: booking.customer_name || booking.profiles?.full_name || 'Valued Guest',
        customerEmail: targetEmail,
        customerPhone: booking.mobile_number || booking.profiles?.phone || '',
        hallName: booking.hall_name,
        eventDate: booking.event_date,
        sessionSlot: booking.session,
        eventType: booking.event_type
      },
      type
    );
    if (emailResult.success) {
      const deliveredTo = emailResult.recipient || targetEmail;
      const successText = `Confirmation email sent to ${deliveredTo}`;
      setMessage(successText);
      setToast({ type: 'success', message: successText });
    } else {
      console.warn(`[Edge Function Manual Send Error]:`, emailResult.message);
      const failText = `Email could not be delivered: ${emailResult.message}`;
      setError(failText);
      setToast({ type: 'error', message: failText });
    }
    setBusy(false);
  };

  const saveHall = async (hall: VenueHall) => {
    if (!supabase) return;
    const price = Number(hall.price);
    if (!hall.name.trim() || !hall.category.trim() || !Number.isFinite(price) || price <= 0) {
      const valError = 'Enter a hall name, category, and valid positive price before saving.';
      setError(valError);
      setToast({ type: 'error', message: valError });
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');

    const cleanHighlights = (
      hall.highlights ||
      hall.details?.highlights ||
      []
    )
      .map((item) => String(item).trim())
      .filter(Boolean);

    const cleanSuitableEvents = (
      hall.suitable_events ||
      hall.suitableEvents ||
      hall.details?.suitableEvents ||
      []
    )
      .map((item) => String(item).trim())
      .filter(Boolean);

    const updatedDetails = {
      ...(hall.details || {}),
      highlights: cleanHighlights,
      suitableEvents: cleanSuitableEvents
    };

    const updatePayload: Record<string, unknown> = {
      name: hall.name.trim(),
      category: hall.category.trim(),
      price,
      description: hall.description || '',
      image_url: hall.image_url || '',
      is_active: hall.is_active,
      details: updatedDetails,
      highlights: cleanHighlights,
      suitable_events: cleanSuitableEvents,
      updated_at: new Date().toISOString()
    };

    // Primary: update with highlights & suitable_events columns + details and chain .select()
    let { data, error: saveError } = await supabase
      .from('venue_halls')
      .update(updatePayload)
      .eq('id', hall.id)
      .select();

    // Fallback if direct highlights/suitable_events columns are not in PostgREST schema cache
    if (saveError && (saveError.message?.includes('column of \'venue_halls\' in the schema cache') || saveError.code === 'PGRST204')) {
      const fallbackPayload = {
        name: hall.name.trim(),
        category: hall.category.trim(),
        price,
        description: hall.description || '',
        image_url: hall.image_url || '',
        is_active: hall.is_active,
        details: updatedDetails,
        updated_at: new Date().toISOString()
      };
      const retryResult = await supabase
        .from('venue_halls')
        .update(fallbackPayload)
        .eq('id', hall.id)
        .select();
      data = retryResult.data;
      saveError = retryResult.error;
    }

    // Fallback via RPC admin_update_hall_details if direct table update returned 0 rows
    if ((!data || data.length === 0) && !saveError) {
      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc('admin_update_hall_details', {
          p_hall_id: hall.id,
          p_name: hall.name.trim(),
          p_category: hall.category.trim(),
          p_price: price,
          p_description: hall.description || '',
          p_image_url: hall.image_url || '',
          p_is_active: hall.is_active,
          p_highlights: cleanHighlights,
          p_suitable_events: cleanSuitableEvents
        });
        if (!rpcErr && rpcData) {
          data = [rpcData];
          saveError = null;
        }
      } catch {
        // Continue to validation
      }
    }

    if (saveError) {
      const errText = `Failed to save ${hall.name}: ${saveError.message}`;
      setError(errText);
      setToast({ type: 'error', message: errText });
      setBusy(false);
      return;
    }

    // Verify data.length > 0
    if (!data || data.length === 0) {
      const rlsError = `Supabase Row-Level Security (RLS) blocked the update on venue_halls (0 rows updated). Please execute the migration SQL in your Supabase SQL Editor.`;
      setError(rlsError);
      setToast({ type: 'error', message: rlsError });
      setBusy(false);
      return;
    }

    const successText = `${hall.name} saved successfully! (${cleanHighlights.length} highlights, ${cleanSuitableEvents.length} suitable events)`;
    setMessage(successText);
    setToast({ type: 'success', message: successText });
    await loadDashboard();
    setBusy(false);
  };

  const uploadHallPhoto = async (hallId: string, file?: File) => {
    if (!supabase || !file) return;
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      setError('Choose an image smaller than 8 MB.');
      return;
    }
    setBusy(true);
    const safeFileName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
    const storagePath = `halls/${hallId}/${crypto.randomUUID()}-${safeFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('venue-gallery')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      const { data } = supabase.storage.from('venue-gallery').getPublicUrl(storagePath);
      const hall = halls.find((item) => item.id === hallId);
      if (hall) await saveHall({ ...hall, image_url: data.publicUrl });
    }
    setBusy(false);
  };

  const uploadHeroSlidePhoto = async (index: number, file?: File) => {
    if (!supabase || !file) return;
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      setError('Choose an image smaller than 8 MB.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    const safeFileName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
    const storagePath = `hero/slide-${index + 1}-${crypto.randomUUID()}-${safeFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('venue-gallery')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      const { data } = supabase.storage.from('venue-gallery').getPublicUrl(storagePath);
      const currentHeroImages = Array.isArray(content.heroImages) ? [...content.heroImages] : ['', '', ''];
      while (currentHeroImages.length < 3) currentHeroImages.push('');
      currentHeroImages[index] = data.publicUrl;
      const updatedContent: SiteContent = {
        ...content,
        heroImages: currentHeroImages,
        ...(index === 0 ? { heroImage: data.publicUrl } : {})
      };
      setContent(updatedContent);
      const { error: saveError } = await supabase.from('site_content').upsert({
        id: 'public',
        content: updatedContent,
        updated_by: session?.user.id,
        updated_at: new Date().toISOString()
      });
      if (saveError) {
        setError(saveError.message);
      } else {
        setMessage(`Hero background slide ${index + 1} photo uploaded successfully and updated on the home page!`);
      }
    }
    setBusy(false);
  };

  const resetHeroSlidePhoto = async (index: number) => {
    if (!supabase) return;
    if (!window.confirm(`Reset Hero Slide ${index + 1} back to default photograph?`)) return;
    setBusy(true);
    const currentHeroImages = Array.isArray(content.heroImages) ? [...content.heroImages] : ['', '', ''];
    while (currentHeroImages.length < 3) currentHeroImages.push('');
    currentHeroImages[index] = '';
    const updatedContent: SiteContent = {
      ...content,
      heroImages: currentHeroImages,
      ...(index === 0 ? { heroImage: '' } : {})
    };
    setContent(updatedContent);
    await supabase.from('site_content').upsert({
      id: 'public',
      content: updatedContent,
      updated_by: session?.user.id,
      updated_at: new Date().toISOString()
    });
    setMessage(`Hero Slide ${index + 1} reset to default.`);
    setBusy(false);
  };



  const saveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: saveError } = await supabase.from('site_content').upsert({
      id: 'public',
      content,
      updated_by: session?.user.id,
      updated_at: new Date().toISOString()
    });
    if (saveError) setError(saveError.message);
    else setMessage('Website information saved.');
    setBusy(false);
  };

  const updateEvent = (index: number, field: keyof SiteEvent, value: string) => {
    const events = [...(content.events || [])];
    events[index] = { ...events[index], [field]: value };
    setContent({ ...content, events });
  };

  const addEvent = () => {
    setContent({
      ...content,
      events: [...(content.events || []), { title: '', desc: '' }]
    });
  };

  const removeEvent = (index: number) => {
    setContent({
      ...content,
      events: (content.events || []).filter((_, itemIndex) => itemIndex !== index)
    });
  };

  const updateFacility = (index: number, field: 'title' | 'subtitle' | 'description', value: string) => {
    const facilities = [...(content.facilities || [])];
    facilities[index] = { ...facilities[index], [field]: value };
    setContent({ ...content, facilities });
  };

  const addFacility = () => {
    setContent({
      ...content,
      facilities: [...(content.facilities || []), {
        id: `facility-${crypto.randomUUID()}`,
        title: '',
        subtitle: '',
        description: ''
      }]
    });
  };

  const removeFacility = (index: number) => {
    setContent({
      ...content,
      facilities: (content.facilities || []).filter((_, itemIndex) => itemIndex !== index)
    });
  };

  const addGalleryPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    const form = event.currentTarget;
    const file = form.querySelector<HTMLInputElement>('input[name="galleryPhoto"]')?.files?.[0];
    if (!file || !newGalleryTitle.trim()) {
      setError('Enter a photo title and choose an image.');
      return;
    }
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      setError('Choose an image smaller than 8 MB.');
      return;
    }

    setBusy(true);
    setError('');
    const safeFileName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
    const storagePath = `gallery/${crypto.randomUUID()}-${safeFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('venue-gallery')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const { data: imageData } = supabase.storage.from('venue-gallery').getPublicUrl(storagePath);
    const { error: insertError } = await supabase.from('gallery_items').insert({
      title: newGalleryTitle.trim(),
      image_url: imageData.publicUrl,
      storage_path: storagePath,
      display_order: gallery.length
    });
    if (insertError) {
      setError(insertError.message);
    } else {
      setNewGalleryTitle('');
      form.reset();
      setMessage('Photo added to the public gallery.');
      await loadDashboard();
    }
    setBusy(false);
  };

  const removeGalleryPhoto = async (item: GalleryItem) => {
    if (!supabase || !window.confirm(`Remove "${item.title}" from the gallery?`)) return;
    setBusy(true);
    setError('');
    const { error: deleteError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', item.id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('venue-gallery')
          .remove([item.storage_path]);
        if (storageError) setError(storageError.message);
      }
      await loadDashboard();
    }
    setBusy(false);
  };

  
  if (!isSupabaseConfigured || !supabase) {
    return (
      <AdminShell>
        <AdminNotice title="Supabase setup required">
          Set <code>VITE_SUPABASE_URL</code> and either <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> or <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>, apply the SQL migration, then reload this page.
        </AdminNotice>
      </AdminShell>
    );
  }

  if (!ready) {
    return <AdminShell><p className="text-center text-[#FFF0D5]">Checking administrator session…</p></AdminShell>;
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#050C16] via-[#0B192C] to-[#081220] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Ambient royal gold and maroon glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C99A43]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-[#741B1B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <form
            onSubmit={handleLogin}
            className="rounded-2xl border-2 border-[#C99A43] bg-[#0B192C]/95 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            {/* Header Emblem & Title */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#741B1B] to-[#451010] border-2 border-[#C99A43] shadow-lg text-2xl text-[#F3CF7A] mb-3">
                🏛️
              </div>
              <h1
                className="text-2xl font-bold tracking-[0.16em] text-[#FFF9EE] uppercase"
                style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}
              >
                Buntara Bhavana
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-[#C99A43]">
                ADMINISTRATOR PORTAL
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C99A43] to-transparent mx-auto mt-3 mb-2" />
              <p className="text-xs text-gray-300">
                Sign in with authorized administrative credentials to manage venue operations.
              </p>
            </div>

            {/* Email Field */}
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F3CF7A] mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                autoComplete="off"
                name="admin_login_email"
                value={login.email}
                onChange={(event) => setLogin({ ...login, email: event.target.value })}
                placeholder="buntarabhavanagkere@gmail.com"
                className="w-full rounded-lg border border-[#C99A43]/40 bg-[#081220] px-3.5 py-2.5 text-sm text-[#FFF9EE] placeholder-gray-500 focus:border-[#C99A43] focus:outline-none focus:ring-1 focus:ring-[#C99A43] transition-colors"
              />
            </div>

            {/* Password Field with Show/Hide Eye Toggle */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F3CF7A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  name="admin_login_password"
                  value={login.password}
                  onChange={(event) => setLogin({ ...login, password: event.target.value })}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#C99A43]/40 bg-[#081220] px-3.5 py-2.5 pr-11 text-sm text-[#FFF9EE] placeholder-gray-500 focus:border-[#C99A43] focus:outline-none focus:ring-1 focus:ring-[#C99A43] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#F3CF7A] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Feedback */}
            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/50 bg-red-950/80 p-3 text-xs text-red-200 shadow-sm"
              >
                <span className="text-base leading-none shrink-0">⚠️</span>
                <span className="flex-1 leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#C99A43] via-[#E1B863] to-[#C99A43] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#0B192C] shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {busy ? 'Verifying Credentials…' : 'Sign In to Admin Portal'}
            </button>

            {/* Return Link */}
            <a
              href="/"
              className="mt-5 block text-center text-xs font-semibold text-[#F3CF7A] hover:text-[#FFF9EE] hover:underline tracking-wide transition-colors"
            >
              ← Return to Customer Website
            </a>
          </form>
        </div>
      </main>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Buntara Bhavana</p>
            <h1 className="mt-1 text-2xl font-bold text-[#FFF9EE]">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-lg border border-gray-300/60 px-3 py-2 text-sm text-[#FFF9EE] hover:bg-white/10">Public site</a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-[#C99A43] hover:bg-[#E1B863] px-3.5 py-2 text-sm font-bold text-gray-950 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Admin sections">
          {ADMIN_SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${activeSection === section ? 'bg-[#C99A43] text-gray-900' : 'border border-gray-200 text-[#FFF0D5] hover:bg-white/10'}`}
            >
              {section}
            </button>
          ))}
        </nav>

        {/* Floating Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-[9999] max-w-md flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm backdrop-blur-md transition-all ${
            toast.type === 'error'
              ? 'bg-red-950/95 text-red-100 border-red-500/50'
              : 'bg-emerald-950/95 text-emerald-100 border-emerald-500/50'
          }`}>
            <span className="text-lg">{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <div className="flex-1">
              <p className="font-semibold">{toast.type === 'error' ? 'Admin Action Blocked' : 'Success'}</p>
              <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
            </div>
            <button type="button" onClick={() => setToast(null)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {(error || message) && (
          <div className={`mt-4 rounded-lg border p-3 text-sm ${error ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`} role={error ? 'alert' : 'status'}>
            {error || message}
          </div>
        )}

        {activeSection === 'Bookings' && (
          <section className="mt-6 space-y-4">
            <SectionHeading
              title="Hall Bookings Management"
              subtitle="Review pending booking enquiries, manage confirmed dates, cancel reservations, and send automated customer notifications."
            />
            {bookings.length === 0 && <EmptyState>No booking enquiries have been submitted yet.</EmptyState>}

            {/* Selection & History Cleanup Toolbar */}
            {bookings.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#741B1B] focus:ring-[#741B1B] cursor-pointer"
                    />
                    <span>Select All ({bookings.length} Bookings)</span>
                  </label>
                  {selectedBookingIds.length > 0 && (
                    <span className="text-xs font-semibold text-[#741B1B] bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {selectedBookingIds.length} selected
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={selectedBookingIds.length === 0 || busy}
                  onClick={handleDeleteSelected}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer ${
                    selectedBookingIds.length > 0
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({selectedBookingIds.length})</span>
                </button>
              </div>
            )}

            {bookings.map((booking) => {
              // Prioritize the exact customer email entered during public hall booking
              const customerEmail =
                booking.email_address ||
                booking.customer_email ||
                booking.email ||
                booking.profiles?.email ||
                '';
              const customerName = booking.customer_name || booking.profiles?.full_name || 'Guest Customer';
              const customerPhone = booking.mobile_number || booking.profiles?.phone || 'No phone provided';
              const isSelected = selectedBookingIds.includes(booking.id);

              return (
                <article
                  key={booking.id}
                  className={`rounded-xl border bg-white p-5 text-gray-900 shadow-xs transition-colors ${
                    isSelected
                      ? 'border-[#C99A43] bg-amber-50/20 ring-1 ring-[#C99A43]'
                      : 'border-gray-200 hover:border-[#C99A43]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Individual selection checkbox */}
                    <div className="pt-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectBooking(booking.id)}
                        aria-label={`Select booking ${booking.reference_code}`}
                        className="w-4 h-4 rounded border-gray-300 text-[#741B1B] focus:ring-[#741B1B] cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between flex-1 min-w-0">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-lg text-[#741B1B]">{booking.event_type} · {booking.hall_name}</h2>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0B192C] text-[#F3CF7A] border border-[#C99A43]/50 uppercase tracking-wide">
                            {booking.hall_id === 'malady-tunga' ? 'Hall 1 (AC)' : booking.hall_id === 'kaashi-shetty' ? 'Hall 2 (Non-AC)' : 'Hall 3 (Mini)'}
                          </span>
                          <StatusBadge status={booking.status} />
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                          📅 <strong>{booking.event_date}</strong> · ⏰ <strong>{booking.session}</strong> · 👥 {booking.number_of_guests ? `${booking.number_of_guests} guests` : 'Guest count not given'}
                        </p>

                        {/* Customer Contact Details with High-Contrast Exact Email Badge */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-900 px-2.5 py-1 rounded-md border border-gray-200 font-semibold">
                            <span>👤</span> {customerName}
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-950 px-2.5 py-1 rounded-md border border-emerald-300 font-medium">
                            <span>✉️</span>
                            <span>Customer Email:</span>
                            <strong className="text-emerald-900 underline underline-offset-2">{customerEmail || 'No email provided'}</strong>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
                            <span>📞</span> {customerPhone}
                          </span>
                        </div>

                        {booking.additional_message && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-600 bg-amber-50/60 p-2.5 rounded border border-amber-200/50">
                            <strong>Notes:</strong> {booking.additional_message}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 pt-1">
                          Reference: <span className="font-mono font-semibold text-[#A64B2A]">{booking.reference_code}</span> · Submitted {new Date(booking.submitted_at).toLocaleString()}
                        </p>

                        {booking.admin_note && (
                          <p className="text-xs text-gray-600">
                            <strong>Admin note:</strong> {booking.admin_note}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons & Individual Delete */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:self-center">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              disabled={busy}
                              type="button"
                              onClick={() => decideBooking(booking, 'approved')}
                              className="rounded-lg bg-emerald-800 hover:bg-emerald-900 px-3.5 py-2 text-sm font-semibold text-white shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              disabled={busy}
                              type="button"
                              onClick={() => decideBooking(booking, 'rejected')}
                              className="rounded-lg bg-red-800 hover:bg-red-900 px-3.5 py-2 text-sm font-semibold text-white shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(booking.status === 'approved' || (booking.status as string) === 'confirmed') && (
                          <>
                            <button
                              disabled={busy}
                              type="button"
                              onClick={() => resendNotificationEmail(booking, 'approved')}
                              className="rounded-lg border border-emerald-800 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50 cursor-pointer transition-colors"
                            >
                              Resend Email
                            </button>
                            <button
                              disabled={busy}
                              type="button"
                              onClick={() => handleCancelBooking(booking)}
                              className="rounded-lg bg-red-700 hover:bg-red-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
                            >
                              Cancel Booking
                            </button>
                          </>
                        )}

                        {booking.status === 'cancelled' && (
                          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200">
                            Slot Released
                          </span>
                        )}

                        {/* Small Individual Delete Button (Trash Icon) */}
                        <button
                          disabled={busy}
                          type="button"
                          onClick={() => handleDeleteBooking(booking)}
                          title="Permanently Delete Booking"
                          className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 disabled:opacity-50 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {activeSection === 'Halls' && (
          <section className="mt-6 space-y-4">
            <SectionHeading title="Manage halls" subtitle="Edits here update the hall cards and booking form on the public site." />
            {halls.map((hall) => (
              <HallEditor key={hall.id} hall={hall} busy={busy} onSave={saveHall} onUpload={uploadHallPhoto} />
            ))}
          </section>
        )}

        {activeSection === 'Website content' && (
          <div className="space-y-6 mt-6">
            {/* Hero Background Images (3 Sequential Photos) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-gray-900">
              <SectionHeading
                title="Hero Background Images (3 Sequential Photos)"
                subtitle="Upload, replace, or preview the 3 sequential background photos that smoothly transition on the main home page hero section."
              />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Slide 1: Exterior Front View',
                    defaultImg: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-1-c21f8b6e-007e-47c4-b860-801dcbf7187e-WhatsApp_Image_2026-11-12_at_3.23.30_PM__1__-_Copy_-_Copy.jpeg',
                    desc: 'Grand front view of Buntara Bhavana Guruvayankere'
                  },
                  {
                    title: 'Slide 2: Grand Celebration Hall',
                    defaultImg: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-2-eeeeca3e-4660-4382-a5fb-f61e01a97357-WhatsApp_Image_2026-11-12_at_3.23.59_PM.jpeg',
                    desc: 'Malady Tunga air-conditioned banquet hall & wedding stage'
                  },
                  {
                    title: 'Slide 3: Cultural Ambiance & Dining',
                    defaultImg: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-3-9f8928df-30e9-461b-96bb-1c33a09b3c8b-WhatsApp_Image_2026-11-12_at_3.24.31_PM.jpeg',
                    desc: 'Traditional cultural hall & spacious community dining'
                  }
                ].map((slide, idx) => {
                  const heroImgArray = Array.isArray(content.heroImages) ? content.heroImages : [];
                  const activeUrl = heroImgArray[idx] || (idx === 0 ? (typeof content.heroImage === 'string' ? content.heroImage : '') : '') || slide.defaultImg;
                  const isCustom = Boolean(heroImgArray[idx] && heroImgArray[idx] !== slide.defaultImg);
                  return (
                    <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm text-[#741B1B]">{slide.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${isCustom ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {isCustom ? 'Custom Upload' : 'Default Photo'}
                          </span>
                        </div>
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 bg-gray-900 mb-3 group">
                          <img
                            src={activeUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = slide.defaultImg;
                            }}
                          />
                          <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                            Slot {idx + 1}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{slide.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <label className="block text-xs font-semibold text-gray-700">
                          Upload / Replace Photo (Slide {idx + 1})
                          <input
                            type="file"
                            accept="image/*"
                            disabled={busy}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadHeroSlidePhoto(idx, file);
                            }}
                            className="mt-1 block w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#741B1B] file:text-white hover:file:bg-[#5A1015] file:cursor-pointer"
                          />
                        </label>
                        {isCustom && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => resetHeroSlidePhoto(idx)}
                            className="text-xs text-red-700 hover:text-red-900 underline block cursor-pointer"
                          >
                            Reset Slide {idx + 1} to Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={saveContent} className="mt-6 rounded-xl border border-gray-200 bg-white p-5 text-gray-900">
            <SectionHeading title="Website information" subtitle="These values are displayed on the public About, Facilities, Events, and Contact sections." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label="Homepage banner label" value={content.heroKicker} onChange={(value) => setContent({ ...content, heroKicker: value })} />
              <TextField label="Homepage banner message" value={content.heroTagline} onChange={(value) => setContent({ ...content, heroTagline: value })} />
              <TextField label="About heading" value={content.aboutTitle} onChange={(value) => setContent({ ...content, aboutTitle: value })} />
              <TextField label="Halls section heading" value={content.hallsTitle} onChange={(value) => setContent({ ...content, hallsTitle: value })} />
              <TextField label="Halls section subtitle" value={content.hallsSubtitle} onChange={(value) => setContent({ ...content, hallsSubtitle: value })} />
              <TextField label="Events heading" value={content.eventsTitle} onChange={(value) => setContent({ ...content, eventsTitle: value })} />
              <TextField label="About introduction" value={content.aboutIntro} onChange={(value) => setContent({ ...content, aboutIntro: value })} multiline />
              <TextField label="About details" value={content.aboutDetails} onChange={(value) => setContent({ ...content, aboutDetails: value })} multiline />
              <TextField label="Facilities introduction" value={content.facilitiesIntro} onChange={(value) => setContent({ ...content, facilitiesIntro: value })} multiline />
              <TextField label="Office address" value={content.contactAddress} onChange={(value) => setContent({ ...content, contactAddress: value })} multiline />
              <TextField label="Contact phone" value={content.contactPhone} onChange={(value) => setContent({ ...content, contactPhone: value })} />
              <TextField label="Contact email" value={content.contactEmail} onChange={(value) => setContent({ ...content, contactEmail: value })} />
              <TextField label="Office hours" value={content.officeHours} onChange={(value) => setContent({ ...content, officeHours: value })} />
            </div>
            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#741B1B]">Events</h3>
                <button type="button" onClick={addEvent} className="rounded-lg border border-[#741B1B] px-3 py-2 text-sm font-semibold text-[#741B1B]">Add event</button>
              </div>
              <div className="mt-3 space-y-3">
                {(content.events || []).map((item, index) => (
                  <div key={`${index}-${item.title}`} className="grid gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-[1fr_2fr_auto]">
                    <TextField label="Event title" value={item.title} onChange={(value) => updateEvent(index, 'title', value)} />
                    <TextField label="Description" value={item.desc} onChange={(value) => updateEvent(index, 'desc', value)} multiline />
                    <button type="button" onClick={() => removeEvent(index)} className="self-end rounded-lg px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50">Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#741B1B]">Facilities</h3>
                <button type="button" onClick={addFacility} className="rounded-lg border border-[#741B1B] px-3 py-2 text-sm font-semibold text-[#741B1B]">Add facility</button>
              </div>
              <div className="mt-3 space-y-3">
                {(content.facilities || []).map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
                    <TextField label="Title" value={item.title} onChange={(value) => updateFacility(index, 'title', value)} />
                    <TextField label="Subtitle" value={item.subtitle} onChange={(value) => updateFacility(index, 'subtitle', value)} />
                    <div className="sm:col-span-2"><TextField label="Description" value={item.description} onChange={(value) => updateFacility(index, 'description', value)} multiline /></div>
                    <button type="button" onClick={() => removeFacility(index)} className="justify-self-start rounded-lg px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50">Remove facility</button>
                  </div>
                ))}
              </div>
            </div>
            <button disabled={busy} className="mt-6 rounded-lg bg-[#5A1015] px-5 py-3 font-semibold text-[#FFF0D5] disabled:opacity-50">{busy ? 'Saving…' : 'Save website information'}</button>
          </form>
          </div>
        )}

        {activeSection === 'Gallery' && (
          <section className="mt-6">
            <SectionHeading title="Photo gallery" subtitle="Uploaded images appear in the public site's gallery. Use JPG, PNG, or WebP images." />
            <form onSubmit={addGalleryPhoto} className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
              <label className="flex-1 text-sm font-semibold text-[#741B1B]">Photo title
                <input required value={newGalleryTitle} onChange={(event) => setNewGalleryTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5" />
              </label>
              <label className="flex-1 text-sm font-semibold text-[#741B1B]">Image file
                <input required name="galleryPhoto" type="file" accept="image/*" className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
              </label>
              <button disabled={busy} className="rounded-lg bg-[#5A1015] px-4 py-2.5 font-semibold text-[#FFF0D5] disabled:opacity-50">Upload photo</button>
            </form>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 p-3 text-gray-900">
                    <span className="font-semibold">{item.title}</span>
                    <button type="button" disabled={busy} onClick={() => removeGalleryPhoto(item)} className="text-sm font-semibold text-red-800">Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

                {busy && <p className="mt-4 text-xs text-[#FFF0D5]/70">Working…</p>}
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-slate-900 px-4 py-8 sm:px-6"><div className="mx-auto max-w-7xl">{children}</div></main>;
}

function AdminNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mx-auto max-w-xl rounded-2xl border border-gray-300 bg-white p-7 text-gray-900"><h1 className="text-2xl font-bold text-[#741B1B]">{title}</h1><p className="mt-3 text-sm leading-6">{children}</p></div>;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-xl font-bold text-[#FFF0D5]">{title}</h2><p className="mt-1 text-sm text-[#FFF0D5]/70">{subtitle}</p></div>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-[#FFF0D5]/80">{children}</p>;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const normalized = (status || '').toLowerCase();
  const classes =
    normalized === 'approved' || normalized === 'confirmed'
      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
      : normalized === 'cancelled'
        ? 'bg-rose-100 text-rose-900 border border-rose-300'
        : normalized === 'rejected'
          ? 'bg-red-100 text-red-900 border border-red-300'
          : 'bg-amber-100 text-amber-900 border border-amber-300';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${classes}`}>
      {normalized === 'approved' && '✓ Approved'}
      {normalized === 'cancelled' && '✕ Cancelled'}
      {normalized === 'rejected' && '✕ Rejected'}
      {normalized === 'pending' && '⏳ Pending Review'}
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const className = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#C99A43] focus:outline-none focus:ring-1 focus:ring-[#C99A43]';
  return (
    <label className="block text-sm font-semibold text-[#741B1B]">
      {label}
      {multiline
        ? <textarea rows={rows} value={value || ''} onChange={(event) => onChange(event.target.value)} className={className} />
        : <input value={value || ''} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  );
}

function HallEditor({
  hall,
  busy,
  onSave,
  onUpload
}: {
  hall: VenueHall;
  busy: boolean;
  onSave: (hall: VenueHall) => void;
  onUpload: (hallId: string, file?: File) => void;
}) {
  const [draft, setDraft] = useState(hall);
  const [highlightsText, setHighlightsText] = useState(
    (hall.highlights || hall.details?.highlights || []).join('\n')
  );
  const [suitableEventsText, setSuitableEventsText] = useState(
    (hall.suitable_events || hall.suitableEvents || hall.details?.suitableEvents || []).join('\n')
  );
  const highlightsInputRef = useRef<HTMLTextAreaElement>(null);
  const suitableEventsInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(hall);
    setHighlightsText((hall.highlights || hall.details?.highlights || []).join('\n'));
    setSuitableEventsText((hall.suitable_events || hall.suitableEvents || hall.details?.suitableEvents || []).join('\n'));
  }, [hall]);

  const change = (field: keyof VenueHall, value: string | boolean | number) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const changeDetail = (field: string, value: string[]) =>
    setDraft((prev) => ({
      ...prev,
      details: { ...(prev.details || {}), [field]: value }
    }));

  const changeTiming = (field: 'morning' | 'evening' | 'note', value: string) =>
    setDraft((prev) => ({
      ...prev,
      details: {
        ...(prev.details || {}),
        timings: { ...(prev.details?.timings || {}), [field]: value }
      }
    }));

  const handleAddHighlight = () => {
    setHighlightsText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n` : '';
    });
    setTimeout(() => {
      if (highlightsInputRef.current) {
        highlightsInputRef.current.focus();
        highlightsInputRef.current.scrollTop = highlightsInputRef.current.scrollHeight;
        const len = highlightsInputRef.current.value.length;
        highlightsInputRef.current.setSelectionRange(len, len);
      }
    }, 50);
  };

  const handleAddSuitableEvent = () => {
    setSuitableEventsText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n` : '';
    });
    setTimeout(() => {
      if (suitableEventsInputRef.current) {
        suitableEventsInputRef.current.focus();
        suitableEventsInputRef.current.scrollTop = suitableEventsInputRef.current.scrollHeight;
        const len = suitableEventsInputRef.current.value.length;
        suitableEventsInputRef.current.setSelectionRange(len, len);
      }
    }, 50);
  };

  const handleSave = () => {
    const cleanHighlights = highlightsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const cleanSuitableEvents = suitableEventsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const updatedHall: VenueHall = {
      ...draft,
      highlights: cleanHighlights,
      suitable_events: cleanSuitableEvents,
      suitableEvents: cleanSuitableEvents,
      details: {
        ...(draft.details || {}),
        highlights: cleanHighlights,
        suitableEvents: cleanSuitableEvents
      }
    };
    onSave(updatedHall);
  };

  const highlightCount = highlightsText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean).length;

  const suitableEventsCount = suitableEventsText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean).length;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Hall name" value={draft.name} onChange={(value) => change('name', value)} />
        <TextField label="Category" value={draft.category} onChange={(value) => change('category', value)} />
        <TextField label="Price (INR)" value={draft.price} onChange={(value) => change('price', value)} />
        <TextField label="Image URL" value={draft.image_url} onChange={(value) => change('image_url', value)} />
        <div className="sm:col-span-2">
          <TextField label="Description" value={draft.description} onChange={(value) => change('description', value)} multiline rows={3} />
        </div>
        <TextField label="Morning hours" value={draft.details?.timings?.morning || ''} onChange={(value) => changeTiming('morning', value)} />
        <TextField label="Evening hours" value={draft.details?.timings?.evening || ''} onChange={(value) => changeTiming('evening', value)} />
        <div className="sm:col-span-2">
          <TextField label="Timing note" value={draft.details?.timings?.note || ''} onChange={(value) => changeTiming('note', value)} />
        </div>

        {/* Unlimited Highlights (One Per Line) Editor */}
        <div className="sm:col-span-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`highlights-${draft.id}`} className="block text-sm font-bold text-[#741B1B]">
                Highlights (one per line)
              </label>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                <span>✦</span>
                <span>{highlightCount} highlight{highlightCount === 1 ? '' : 's'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#741B1B] hover:bg-[#5A1015] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Highlight</span>
            </button>
          </div>

          <textarea
            id={`highlights-${draft.id}`}
            ref={highlightsInputRef}
            rows={Math.max(6, highlightsText.split('\n').length + 2)}
            value={highlightsText}
            onChange={(e) => {
              setHighlightsText(e.target.value);
              const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
              changeDetail('highlights', lines);
            }}
            placeholder={`Enter hall highlights, one per line:\nFully air-conditioned grand celebration hall\nSeparate dining hall facility for guests\nConvenient lift facility for senior citizens\nDedicated parking space for 50+ vehicles\nSpacious stage and dressing suites`}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 leading-relaxed placeholder-gray-400 focus:border-[#C99A43] focus:outline-none focus:ring-1 focus:ring-[#C99A43] transition-all resize-y min-h-[140px]"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Add unlimited highlights — enter each feature on its own line or click <strong>Add Highlight</strong>. Every line will be permanently saved and rendered on the home page and hall modal.
          </p>
        </div>

        {/* Suitable Events (One Per Line) Editor */}
        <div className="sm:col-span-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`suitable-events-${draft.id}`} className="block text-sm font-bold text-[#741B1B]">
                Suitable events (one per line)
              </label>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-300 px-2.5 py-0.5 text-xs font-semibold text-blue-900">
                <span>✦</span>
                <span>{suitableEventsCount} event{suitableEventsCount === 1 ? '' : 's'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddSuitableEvent}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#741B1B] hover:bg-[#5A1015] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <textarea
            id={`suitable-events-${draft.id}`}
            ref={suitableEventsInputRef}
            rows={Math.max(5, suitableEventsText.split('\n').length + 2)}
            value={suitableEventsText}
            onChange={(e) => {
              setSuitableEventsText(e.target.value);
              const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
              changeDetail('suitableEvents', lines);
            }}
            placeholder={`Enter suitable events, one per line:\nGrand Weddings & Receptions\nEngagement Ceremonies\nMajor Family Celebrations\nCultural Programmes & Yakshagana\nTraditional & Community Occasions`}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 leading-relaxed placeholder-gray-400 focus:border-[#C99A43] focus:outline-none focus:ring-1 focus:ring-[#C99A43] transition-all resize-y min-h-[120px]"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Enter each suitable event on its own line or click <strong>Add Event</strong>. Every line will be saved and rendered on the public website and hall details modal.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
          <input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => change('is_active', event.target.checked)} className="rounded border-gray-300 text-[#741B1B] focus:ring-[#741B1B]" />
          Visible on public site
        </label>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-[#741B1B] px-3.5 py-2 text-sm font-semibold text-[#741B1B] hover:bg-[#741B1B]/5 transition-colors">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(draft.id, event.target.files?.[0])} />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={handleSave}
            title="Save Changes"
            aria-label={`Save Changes for ${draft.name}`}
            className="rounded-lg bg-[#5A1015] hover:bg-[#450C10] px-4 py-2 text-sm font-semibold text-[#FFF0D5] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {busy ? 'Saving Changes…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default AdminApp;
