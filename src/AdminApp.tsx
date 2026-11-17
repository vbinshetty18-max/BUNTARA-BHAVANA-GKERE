import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const ADMIN_SECTIONS = ['Bookings', 'Halls', 'Website content', 'Gallery', 'Users'];

type Booking = {
  id: string;
  reference_code: string;
  event_type: string;
  hall_name: string;
  event_date: string;
  session: string;
  number_of_guests: number | null;
  profiles?: { full_name: string; email: string; phone: string } | null;
  customer_name: string;
  email_address: string;
  mobile_number: string;
  additional_message: string;
  status: 'pending' | 'approved' | 'rejected';
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
  details: {
    highlights?: string[];
    suitableEvents?: string[];
    timings?: { morning?: string; evening?: string; note?: string };
    [key: string]: unknown;
  };
};

type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
};

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  storage_path: string | null;
};

type SiteEvent = { title: string; desc: string };
type SiteContent = {
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
  contactEmail: '',
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<VenueHall[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadDashboard = async () => {
    if (!supabase) return;
    setBusy(true);
    setError('');

    const [bookingResult, hallResult, userResult, galleryResult, contentResult] =
      await Promise.all([
        supabase.from('booking_enquiries').select('*, profiles(full_name, email, phone)').order('submitted_at', { ascending: false }),
        supabase.from('venue_halls').select('*').order('display_order'),
        supabase.from('profiles').select('id, full_name, email, phone, username, role, is_active, created_at').order('created_at', { ascending: false }),
        supabase.from('gallery_items').select('*').order('display_order'),
        supabase.from('site_content').select('content').eq('id', 'public').maybeSingle()
      ]);

    const failedResult = [bookingResult, hallResult, userResult, galleryResult, contentResult]
      .find((result) => result.error);
    if (failedResult?.error) {
      setError(failedResult.error.message);
      setBusy(false);
      return;
    }

    setBookings(bookingResult.data || []);
    setHalls(hallResult.data || []);
    setUsers(userResult.data || []);
    setGallery(galleryResult.data || []);
    setContent({ ...defaultContent, ...(contentResult.data?.content || {}) } as SiteContent);
    setBusy(false);
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
      setAuthorized(false);
      setError(profileError?.message || 'This account does not have administrator access.');
      await supabase.auth.signOut();
      setReady(true);
      return;
    }

    setError('');
    setAuthorized(true);
    await loadDashboard();
    setReady(true);
  };

  useEffect(() => {
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
        setAuthorized(false);
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
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword(login);
    if (loginError) setError(loginError.message);
    setBusy(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError(logoutError.message);
  };

  const decideBooking = async (booking: Booking, status: 'approved' | 'rejected') => {
    if (!supabase) return;
    setBusy(true);
    setError('');
    setMessage('');
    const { error: decisionError } = await supabase.rpc('admin_decide_booking', {
      booking_id: booking.id,
      new_status: status,
      decision_note: ''
    });
    if (decisionError) {
      setError(decisionError.message);
    } else {
      setMessage(`Booking ${booking.reference_code} ${status}.`);
      await loadDashboard();
    }
    setBusy(false);
  };

  const saveHall = async (hall: VenueHall) => {
    if (!supabase) return;
    const price = Number(hall.price);
    if (!hall.name.trim() || !hall.category.trim() || !Number.isFinite(price) || price <= 0) {
      setError('Enter a hall name, category, and valid positive price before saving.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: saveError } = await supabase
      .from('venue_halls')
      .update({
        name: hall.name,
        category: hall.category,
        price,
        description: hall.description,
        image_url: hall.image_url,
        is_active: hall.is_active,
        details: hall.details
      })
      .eq('id', hall.id);

    if (saveError) setError(saveError.message);
    else {
      setMessage(`${hall.name} updated.`);
      await loadDashboard();
    }
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

  const toggleUser = async (user: UserProfile) => {
    if (!supabase || user.role === 'admin') return;
    setBusy(true);
    setError('');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);
    if (updateError) setError(updateError.message);
    else await loadDashboard();
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

  if (!session || !authorized) {
    return (
      <AdminShell>
        <form onSubmit={handleLogin} className="mx-auto w-full max-w-md rounded-2xl border border-[#C99A43] bg-[#FFF0D5] p-7 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A64B2A]">Buntara Bhavana</p>
          <h1 className="mt-2 text-2xl font-bold text-[#5A1015]">Administrator sign in</h1>
          <p className="mt-2 text-sm text-[#6B5144]">Use the administrator account provisioned in Supabase.</p>
          <label className="mt-6 block text-sm font-semibold text-[#5A1015]">
            Email
            <input required type="email" autoComplete="username" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} className="mt-1 w-full rounded-lg border border-[#C99A43] bg-white px-3 py-2.5" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-[#5A1015]">
            Password
            <input required type="password" autoComplete="current-password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} className="mt-1 w-full rounded-lg border border-[#C99A43] bg-white px-3 py-2.5" />
          </label>
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-[#5A1015] px-4 py-3 font-semibold text-[#FFF0D5] disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <a href="/" className="mt-4 block text-center text-sm font-semibold text-[#741B1B] underline">Return to customer website</a>
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-[#C99A43]/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C99A43]">Buntara Bhavana</p>
            <h1 className="mt-1 text-2xl font-bold text-[#FFF0D5]">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-lg border border-[#C99A43]/60 px-3 py-2 text-sm text-[#FFF0D5] hover:bg-white/10">Public site</a>
            <button type="button" onClick={handleLogout} className="rounded-lg bg-[#C99A43] px-3 py-2 text-sm font-semibold text-[#48251B]">Sign out</button>
          </div>
        </header>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Admin sections">
          {ADMIN_SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${activeSection === section ? 'bg-[#C99A43] text-[#48251B]' : 'border border-[#C99A43]/50 text-[#FFF0D5] hover:bg-white/10'}`}
            >
              {section}
            </button>
          ))}
        </nav>

        {(error || message) && (
          <div className={`mt-4 rounded-lg border p-3 text-sm ${error ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`} role={error ? 'alert' : 'status'}>
            {error || message}
          </div>
        )}

        {activeSection === 'Bookings' && (
          <section className="mt-6 space-y-4">
            <SectionHeading title="Booking enquiries" subtitle="Review customer requests and approve or reject pending dates." />
            {bookings.length === 0 && <EmptyState>No booking enquiries have been submitted.</EmptyState>}
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5] p-5 text-[#48251B]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-[#5A1015]">{booking.event_type} · {booking.hall_name}</h2>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-2 text-sm">{booking.event_date} · {booking.session} · {booking.number_of_guests || 'Guest count not given'}</p>
                    <p className="mt-1 text-sm">{booking.profiles?.full_name || booking.customer_name} · {booking.profiles?.email || booking.email_address} · {booking.profiles?.phone || booking.mobile_number}</p>
                    {booking.additional_message && <p className="mt-2 text-sm text-[#6B5144]">{booking.additional_message}</p>}
                    <p className="mt-2 text-xs text-[#A64B2A]">Reference: {booking.reference_code} · Submitted {new Date(booking.submitted_at).toLocaleString()}</p>
                    {booking.admin_note && <p className="mt-2 text-sm"><strong>Admin note:</strong> {booking.admin_note}</p>}
                  </div>
                  {booking.status === 'pending' && (
                    <div className="flex shrink-0 gap-2">
                      <button disabled={busy} type="button" onClick={() => decideBooking(booking, 'approved')} className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>
                      <button disabled={busy} type="button" onClick={() => decideBooking(booking, 'rejected')} className="rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
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
          <form onSubmit={saveContent} className="mt-6 rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5] p-5 text-[#48251B]">
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
            <div className="mt-6 border-t border-[#C99A43]/50 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#5A1015]">Events</h3>
                <button type="button" onClick={addEvent} className="rounded-lg border border-[#741B1B] px-3 py-2 text-sm font-semibold text-[#741B1B]">Add event</button>
              </div>
              <div className="mt-3 space-y-3">
                {(content.events || []).map((item, index) => (
                  <div key={`${index}-${item.title}`} className="grid gap-3 rounded-lg border border-[#C99A43]/50 p-3 sm:grid-cols-[1fr_2fr_auto]">
                    <TextField label="Event title" value={item.title} onChange={(value) => updateEvent(index, 'title', value)} />
                    <TextField label="Description" value={item.desc} onChange={(value) => updateEvent(index, 'desc', value)} multiline />
                    <button type="button" onClick={() => removeEvent(index)} className="self-end rounded-lg px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50">Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-[#C99A43]/50 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#5A1015]">Facilities</h3>
                <button type="button" onClick={addFacility} className="rounded-lg border border-[#741B1B] px-3 py-2 text-sm font-semibold text-[#741B1B]">Add facility</button>
              </div>
              <div className="mt-3 space-y-3">
                {(content.facilities || []).map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border border-[#C99A43]/50 p-3 sm:grid-cols-2">
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
        )}

        {activeSection === 'Gallery' && (
          <section className="mt-6">
            <SectionHeading title="Photo gallery" subtitle="Uploaded images appear in the public site's gallery. Use JPG, PNG, or WebP images." />
            <form onSubmit={addGalleryPhoto} className="mt-4 flex flex-col gap-3 rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5] p-4 sm:flex-row sm:items-end">
              <label className="flex-1 text-sm font-semibold text-[#5A1015]">Photo title
                <input required value={newGalleryTitle} onChange={(event) => setNewGalleryTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-[#C99A43] bg-white px-3 py-2.5" />
              </label>
              <label className="flex-1 text-sm font-semibold text-[#5A1015]">Image file
                <input required name="galleryPhoto" type="file" accept="image/*" className="mt-1 block w-full rounded-lg border border-[#C99A43] bg-white px-3 py-2 text-sm" />
              </label>
              <button disabled={busy} className="rounded-lg bg-[#5A1015] px-4 py-2.5 font-semibold text-[#FFF0D5] disabled:opacity-50">Upload photo</button>
            </form>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5]">
                  <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 p-3 text-[#48251B]">
                    <span className="font-semibold">{item.title}</span>
                    <button type="button" disabled={busy} onClick={() => removeGalleryPhoto(item)} className="text-sm font-semibold text-red-800">Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'Users' && (
          <section className="mt-6">
            <SectionHeading title="User profiles" subtitle="Administrators can view registered profiles and suspend or restore customer access." />
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5]">
              <table className="w-full min-w-[700px] text-left text-sm text-[#48251B]">
                <thead className="bg-[#F8E7C8] text-[#5A1015]">
                  <tr><th className="p-3">Name</th><th className="p-3">Username</th><th className="p-3">Contact</th><th className="p-3">Role</th><th className="p-3">Access</th><th className="p-3">Action</th></tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-[#C99A43]/30">
                      <td className="p-3 font-semibold">{user.full_name}</td>
                      <td className="p-3">@{user.username}</td>
                      <td className="p-3">{user.email}<br />{user.phone}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{user.is_active ? 'Active' : 'Suspended'}</td>
                      <td className="p-3">
                        {user.role === 'admin' ? <span className="text-xs text-[#6B5144]">Administrator</span> : (
                          <button disabled={busy} type="button" onClick={() => toggleUser(user)} className="font-semibold text-[#741B1B] underline">
                            {user.is_active ? 'Suspend' : 'Restore'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {busy && <p className="mt-4 text-xs text-[#FFF0D5]/70">Working…</p>}
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#2D120F] px-4 py-8 sm:px-6"><div className="mx-auto max-w-7xl">{children}</div></main>;
}

function AdminNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mx-auto max-w-xl rounded-2xl border border-[#C99A43] bg-[#FFF0D5] p-7 text-[#48251B]"><h1 className="text-2xl font-bold text-[#5A1015]">{title}</h1><p className="mt-3 text-sm leading-6">{children}</p></div>;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-xl font-bold text-[#FFF0D5]">{title}</h2><p className="mt-1 text-sm text-[#FFF0D5]/70">{subtitle}</p></div>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-[#C99A43]/50 p-8 text-center text-[#FFF0D5]/80">{children}</p>;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const classes = status === 'approved'
    ? 'bg-emerald-100 text-emerald-900'
    : status === 'rejected'
      ? 'bg-red-100 text-red-900'
      : 'bg-amber-100 text-amber-900';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${classes}`}>{status}</span>;
}

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string | number; onChange: (value: string) => void; multiline?: boolean }) {
  const className = 'mt-1 w-full rounded-lg border border-[#C99A43] bg-white px-3 py-2.5 text-sm text-[#48251B]';
  return (
    <label className="block text-sm font-semibold text-[#5A1015]">
      {label}
      {multiline
        ? <textarea rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} className={className} />
        : <input value={value || ''} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  );
}

function HallEditor({ hall, busy, onSave, onUpload }: { hall: VenueHall; busy: boolean; onSave: (hall: VenueHall) => void; onUpload: (hallId: string, file?: File) => void }) {
  const [draft, setDraft] = useState(hall);

  useEffect(() => setDraft(hall), [hall]);

  const change = (field: keyof VenueHall, value: string | boolean | number) => setDraft({ ...draft, [field]: value });
  const changeDetail = (field: string, value: string[]) => setDraft({
    ...draft,
    details: { ...(draft.details || {}), [field]: value }
  });
  const changeTiming = (field: 'morning' | 'evening' | 'note', value: string) => setDraft({
    ...draft,
    details: {
      ...(draft.details || {}),
      timings: { ...(draft.details?.timings || {}), [field]: value }
    }
  });

  return (
    <article className="rounded-xl border border-[#C99A43]/50 bg-[#FFF0D5] p-5 text-[#48251B]">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Hall name" value={draft.name} onChange={(value) => change('name', value)} />
        <TextField label="Category" value={draft.category} onChange={(value) => change('category', value)} />
        <TextField label="Price (INR)" value={draft.price} onChange={(value) => change('price', value)} />
        <TextField label="Image URL" value={draft.image_url} onChange={(value) => change('image_url', value)} />
        <div className="sm:col-span-2"><TextField label="Description" value={draft.description} onChange={(value) => change('description', value)} multiline /></div>
        <TextField label="Morning hours" value={draft.details?.timings?.morning || ''} onChange={(value) => changeTiming('morning', value)} />
        <TextField label="Evening hours" value={draft.details?.timings?.evening || ''} onChange={(value) => changeTiming('evening', value)} />
        <div className="sm:col-span-2"><TextField label="Timing note" value={draft.details?.timings?.note || ''} onChange={(value) => changeTiming('note', value)} /></div>
        <div className="sm:col-span-2"><TextField label="Highlights (one per line)" value={(draft.details?.highlights || []).join('\n')} onChange={(value) => changeDetail('highlights', value.split('\n').filter(Boolean))} multiline /></div>
        <div className="sm:col-span-2"><TextField label="Suitable events (one per line)" value={(draft.details?.suitableEvents || []).join('\n')} onChange={(value) => changeDetail('suitableEvents', value.split('\n').filter(Boolean))} multiline /></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => change('is_active', event.target.checked)} />
          Visible on public site
        </label>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-[#741B1B] px-3 py-2 text-sm font-semibold text-[#741B1B]">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(draft.id, event.target.files?.[0])} />
          </label>
          <button type="button" disabled={busy} onClick={() => onSave(draft)} className="rounded-lg bg-[#5A1015] px-4 py-2 text-sm font-semibold text-[#FFF0D5] disabled:opacity-50">Save hall</button>
        </div>
      </div>
    </article>
  );
}

export default AdminApp;
