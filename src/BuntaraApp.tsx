// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Calendar,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Award,
  HeartHandshake,
  Building2,
  Car,
  ArrowUpDown,
  Utensils,
  Clock,
  Mail,
  Info,
  Image as ImageIcon,
  CalendarDays,
  Wind,
  Landmark,
  UserRound,
  LogOut
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

/**
 * BUNTARA BHAVANA – GURUVAYANKERE
 * Official Traditional Cultural & Wedding Venue Website
 * Designed with strict adherence to South Indian Temple-Inspired Heritage Aesthetics
 */

// Confirmed Venue Halls Data with Authentic Uploaded Photographs & Exact Specifications
const HALLS_DATA = [
  {
    id: 'malady-tunga',
    name: 'MALADY TUNGA AND MUNDAPPA SHETTY VEDIKE',
    category: 'AC HALL',
    price: 75000,
    formattedPrice: '₹75,000',
    description:
      'Experience grand celebrations in an elegant, fully air-conditioned indoor venue that beautifully reflects the traditional Tulunadu and South Indian ambience.',
    // Authentic uploaded photograph: malady.jpg (with graceful local/asset fallback)
    image: './malady.jpg',
    fallbackImages: [
      '/malady.jpg',
      '/assets/images/malady.jpg',
      '/assets/images/malady-tunga.jpg'
    ],
    timings: {
      morning: 'Morning: 10:00 AM – 2:30 PM',
      evening: 'Evening: 6:00 PM – 10:00 PM',
      note: 'Celebrate your special occasions with tradition, elegance and comfort at Buntara Bhavana.'
    },
    highlights: [
      'Fully air-conditioned grand celebration hall',
      'Separate dining hall facility for guests',
      'Convenient lift facility for easy accessibility',
      'Parking facilities for visitors',
      'Spacious and comfortable seating arrangements',
      'Elegant indoor lighting and traditional ambience',
      'Suitable for weddings, receptions, engagements and major family celebrations',
      'Convenient facilities designed to provide a comfortable experience for guests'
    ],
    suitableEvents: [
      'Grand Weddings & Receptions',
      'Engagement Ceremonies',
      'Major Family Celebrations',
      'Traditional & Community Occasions'
    ]
  },
  {
    id: 'kaashi-shetty',
    name: 'KAASHI SHETTY VEDIKE',
    category: 'NON-AC HALL',
    price: 35000,
    formattedPrice: '₹35,000',
    description:
      'Spacious and well-ventilated traditional Non-AC hall offering natural ventilation for guest comfort and heritage-inspired Tulunadu ambience.',
    // Authentic uploaded photograph: kaashi hall.jpg
    image: './kaashi%20hall.jpg',
    fallbackImages: [
      'kaashi hall.jpg',
      '/kaashi hall.jpg',
      '/assets/images/kaashi hall.jpg',
      '/assets/images/kaashi-shetty.jpg'
    ],
    timings: {
      morning: 'Morning Session',
      evening: 'Evening Session',
      note: 'Spacious Non-AC hall with natural ventilation and dedicated guest amenities.'
    },
    structuredFacilities: [
      {
        title: 'Separate Dining Hall',
        desc: 'Dedicated dining space for serving food and hosting guests.',
        icon: 'dining'
      },
      {
        title: 'Lift Facility',
        desc: 'Convenient lift access for senior citizens, elderly guests and people with mobility difficulties.',
        icon: 'lift'
      },
      {
        title: 'Parking Facility',
        desc: "Parking space available for guests' vehicles.",
        icon: 'parking'
      },
      {
        title: 'Natural Ventilation',
        desc: 'Spacious and airy Non-AC hall.',
        icon: 'ventilation'
      },
      {
        title: 'Traditional Interiors',
        desc: 'Heritage-inspired ambience reflecting Tulunadu culture and traditions.',
        icon: 'interiors'
      }
    ],
    highlights: [
      'Spacious and well-ventilated traditional Non-AC hall',
      'Natural ventilation for guest comfort (Non-AC venue)',
      'Separate dining hall for serving food and hosting guests',
      'Convenient lift access for senior citizens and elderly guests',
      'Parking space available for guests’ vehicles',
      'Heritage-inspired interiors reflecting Tulunadu culture and traditions'
    ],
    suitableEvents: [
      'Weddings and receptions',
      'Engagement ceremonies',
      'Family gatherings',
      'Cultural programmes',
      'Yakshagana performances',
      'Traditional and community functions'
    ]
  },
  {
    id: 'arvaguthu-mini',
    name: 'ARVAGUTHU K. NARAYANA RAI VEDIKE',
    category: 'MINI HALL',
    price: 12000,
    formattedPrice: '₹12,000',
    description:
      'A beautifully maintained mini hall offering an elegant and welcoming atmosphere for intimate family celebrations and traditional occasions. With convenient dining hall access, it provides a comfortable experience for smaller gatherings.',
    // Authentic uploaded photograph: arva.jpeg (4th pic)
    image: './arva.jpeg',
    fallbackImages: [
      '/arva.jpeg',
      '/assets/images/arva.jpeg',
      '/assets/images/arvaguthu-mini-hall.jpg'
    ],
    timings: {
      morning: 'Morning Session: 8:00 AM – 3:00 PM',
      evening: 'Evening Session: 6:00 PM – 10:30 PM',
      note: 'Timings should be confirmed with the management before final scheduling.'
    },
    highlights: [
      'Compact, elegant and comfortable setting for small & intimate gatherings',
      'Convenient access to the dining hall',
      'Comfortable arrangements for guests',
      'Suitable for small-scale events and celebrations'
    ],
    suitableEvents: [
      'Engagement ceremonies',
      'Naming ceremonies',
      'Birthday celebrations',
      'Family meetings',
      'Small traditional functions',
      'Private gatherings and special occasions'
    ]
  }
];

// Hero Slide Variations (Strictly anchored to the 1st pic: main pic.jpg)
const HERO_SLIDES = [
  {
    id: 0,
    kicker: 'TRADITION • CULTURE • CELEBRATION',
    title: 'BUNTARA BHAVANA',
    location: 'GURUVAYANKERE',
    tagline: '"A Beautiful Place for Celebrations, Gatherings & Memories."',
    // 1st pic: Home page exterior photograph (main pic.jpg)
    image: './main%20pic.jpg',
    fallbackImages: [
      'main pic.jpg',
      '/main pic.jpg',
      '/assets/images/main pic.jpg',
      '/assets/images/buntara-exterior.jpg'
    ]
  },
  {
    id: 1,
    kicker: 'TULUNADU HERITAGE • SACRED HOSPITALITY',
    title: 'BUNTARA BHAVANA',
    location: 'GURUVAYANKERE',
    tagline: '"Where Timeless Cultural Values Meet Grand Auspicious Occasions."',
    image: './main%20pic.jpg',
    fallbackImages: [
      'main pic.jpg',
      '/main pic.jpg',
      '/assets/images/main pic.jpg',
      '/assets/images/buntara-exterior.jpg'
    ]
  },
  {
    id: 2,
    kicker: 'THREE DISTINCTIVE SPACES • ONE DESTINATION',
    title: 'BUNTARA BHAVANA',
    location: 'GURUVAYANKERE',
    tagline: '"Honoring Every Milestone with Grace, Warmth & Tradition."',
    image: './main%20pic.jpg',
    fallbackImages: [
      'main pic.jpg',
      '/main pic.jpg',
      '/assets/images/main pic.jpg',
      '/assets/images/buntara-exterior.jpg'
    ]
  }
];

// Custom Resilient Venue Image Component:
// Tries exact uploaded filename, URL-encoded path, /assets/images/ path, custom uploaded blob,
// and gracefully renders a traditional South Indian architectural stage SVG if sandbox blocks local disk paths.
const VenueImage = ({
  src,
  fallbacks = [],
  customSrc,
  alt,
  className = '',
  variant = 'hall'
}) => {
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const candidates = [customSrc, src, ...fallbacks].filter(Boolean);

  useEffect(() => {
    setAttemptIndex(0);
    setAllFailed(false);
  }, [customSrc, src]);

  if (allFailed || candidates.length === 0) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#5A1015] via-[#741B1B] to-[#48251B] text-[#FFF0D5] overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle Gold Temple Arch Pattern */}
        <svg
          viewBox="0 0 400 220"
          className="w-full h-full opacity-35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="16" y="16" width="368" height="188" rx="6" stroke="#C99A43" strokeWidth="1.5" />
          <path
            d="M70 204V100C70 55 130 34 200 34C270 34 330 55 330 100V204"
            stroke="#C99A43"
            strokeWidth="2"
          />
          <path
            d="M110 204V112C110 78 150 62 200 62C250 62 290 78 290 112V204"
            stroke="#F3CF7A"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          {variant === 'exterior' ? (
            <>
              <rect x="125" y="88" width="150" height="116" stroke="#C99A43" strokeWidth="1.5" />
              <line x1="125" y1="125" x2="275" y2="125" stroke="#C99A43" strokeWidth="1.2" />
              <line x1="125" y1="162" x2="275" y2="162" stroke="#C99A43" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <rect x="120" y="148" width="160" height="44" stroke="#C99A43" strokeWidth="1.5" />
              <path d="M130 92H270V148H130V92Z" stroke="#C99A43" strokeWidth="1.2" />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span
            className="text-[11px] uppercase tracking-[0.22em] text-[#C99A43] font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Buntara Bhavana • Guruvayankere
          </span>
          <span
            className="mt-1 text-sm sm:text-base font-bold text-[#FFF0D5] max-w-xs"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={candidates[attemptIndex]}
      alt={alt}
      className={className}
      onError={() => {
        if (attemptIndex + 1 < candidates.length) {
          setAttemptIndex((prev) => prev + 1);
        } else {
          setAllFailed(true);
        }
      }}
    />
  );
};

// Confirmed Venue Facilities ONLY (No invented facilities or capacities)
const FACILITIES_DATA = [
  {
    id: 'fac-ac',
    title: 'Malady Tunga and Mundappa Shetty Vedike – AC Hall',
    subtitle: 'Premier Air-Conditioned Main Hall',
    description:
      'Our flagship air-conditioned venue crafted for grand weddings, receptions, and auspicious celebrations.',
    icon: Sparkles
  },
  {
    id: 'fac-nonac',
    title: 'Kaashi Shetty Vedike – Non-AC Hall',
    subtitle: 'Traditional Cultural & Function Hall',
    description:
      'An expansive, naturally airy hall tailored for traditional ceremonies, cultural programs, and family gatherings.',
    icon: Building2
  },
  {
    id: 'fac-mini',
    title: 'Arvaguthu K. Narayana Rai Vedike – Mini Hall',
    subtitle: 'Intimate Celebrations & Gatherings',
    description:
      'A compact, elegant venue ideal for engagement ceremonies, naming ceremonies, and family meetings.',
    icon: Users
  },
  {
    id: 'fac-parking',
    title: 'Parking Facility',
    subtitle: 'Convenient Guest Parking',
    description:
      'Dedicated parking area within the premises for guests and event visitors.',
    icon: Car
  },
  {
    id: 'fac-lift',
    title: 'Lift Facility',
    subtitle: 'Easy Multi-Floor Accessibility',
    description:
      'Convenient lift access for senior citizens, elderly guests, and effortless movement across floors.',
    icon: ArrowUpDown
  },
  {
    id: 'fac-dining',
    title: 'Dining Facility',
    subtitle: 'Dedicated Traditional Dining Hall',
    description:
      'Spacious separate dining facility designed for comfortable traditional South Indian hospitality.',
    icon: Utensils
  }
];

// Custom SVG: Traditional South Indian Temple Emblem Logo
const TempleLogoSVG = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-11 h-11 md:w-12 md:h-12 shrink-0 drop-shadow-sm"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="30" fill="#741B1B" stroke="#C99A43" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="25" stroke="#C99A43" strokeWidth="0.8" strokeDasharray="2 2" />
    {/* Temple Gopuram / Kalasha Silhouette */}
    <path
      d="M32 10L35 16H29L32 10Z"
      fill="#C99A43"
    />
    <path
      d="M25 18H39L42 24H22L25 18Z"
      fill="#FFF0D5"
      stroke="#C99A43"
      strokeWidth="1.2"
    />
    <path
      d="M20 26H44L47 33H17L20 26Z"
      fill="#C99A43"
    />
    <path
      d="M16 35H48V46H16V35Z"
      fill="#FFF0D5"
      stroke="#C99A43"
      strokeWidth="1.2"
    />
    {/* Central Sacred Arch */}
    <path
      d="M27 46V39C27 36.5 29.2 35 32 35C34.8 35 37 36.5 37 39V46H27Z"
      fill="#741B1B"
    />
    {/* Base Pedestal */}
    <rect x="13" y="47" width="38" height="3.5" rx="1" fill="#C99A43" />
  </svg>
);

// Custom SVG: Antique Brass Nilavilakku (Traditional Kerala/Tulunadu Standing Lamp)
const NilavilakkuLampSVG = ({ className = 'w-14 h-36' }) => (
  <svg
    viewBox="0 0 80 220"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9A6B1E" />
        <stop offset="45%" stopColor="#F3CF7A" />
        <stop offset="75%" stopColor="#C99A43" />
        <stop offset="100%" stopColor="#7C5211" />
      </linearGradient>
      <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Warm Flame Halo */}
    <circle cx="40" cy="24" r="22" fill="url(#flameGlow)" />

    {/* Sacred Flame */}
    <path
      d="M40 8C40 8 47 18 47 24C47 28 43.8 31 40 31C36.2 31 33 28 33 24C33 18 40 8 40 8Z"
      fill="#FDE68A"
    />
    <path
      d="M40 13C40 13 44 19.5 44 23.5C44 26 42.2 28 40 28C37.8 28 36 26 36 23.5C36 19.5 40 13 40 13Z"
      fill="#FFFFFF"
    />

    {/* Top Finial (Prabha) */}
    <path d="M40 28L43 36H37L40 28Z" fill="url(#brassGrad)" />
    <circle cx="40" cy="39" r="3.5" fill="url(#brassGrad)" />

    {/* Oil Bowl (Thoni) */}
    <path
      d="M16 44C22 53 58 53 64 44C56 47 24 47 16 44Z"
      fill="url(#brassGrad)"
    />
    <ellipse cx="40" cy="44" rx="22" ry="3.5" fill="#9A6B1E" />

    {/* Central Stem with Traditional Rings */}
    <rect x="37" y="48" width="6" height="132" fill="url(#brassGrad)" />
    <ellipse cx="40" cy="68" rx="9" ry="3" fill="url(#brassGrad)" />
    <ellipse cx="40" cy="96" rx="10" ry="3.5" fill="url(#brassGrad)" />
    <ellipse cx="40" cy="128" rx="9" ry="3" fill="url(#brassGrad)" />
    <ellipse cx="40" cy="158" rx="11" ry="3.5" fill="url(#brassGrad)" />

    {/* Tiered Pedestal Base */}
    <path d="M26 180H54L58 190H22L26 180Z" fill="url(#brassGrad)" />
    <path d="M18 190H62L67 202H13L18 190Z" fill="url(#brassGrad)" />
    <rect x="10" y="202" width="60" height="5" rx="2" fill="#8C5E14" />
  </svg>
);

// Custom SVG: Antique Gold Ornamental Section Divider
const GoldOrnamentalDivider = ({ flip = false }) => (
  <svg
    viewBox="0 0 180 28"
    className={`w-28 sm:w-36 md:w-44 h-6 ${flip ? 'scale-x-[-1]' : ''}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 14H128"
      stroke="#C99A43"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M42 14C52 6 66 6 76 14C86 22 100 22 110 14"
      stroke="#C99A43"
      strokeWidth="1.3"
      fill="none"
    />
    {/* Lotus / Temple Motif at Inner Tip */}
    <path
      d="M134 14L144 6L154 14L144 22L134 14Z"
      fill="#741B1B"
      stroke="#C99A43"
      strokeWidth="1.5"
    />
    <circle cx="164" cy="14" r="3.5" fill="#C99A43" />
    <circle cx="174" cy="14" r="2" fill="#741B1B" />
  </svg>
);

// Custom SVG: Traditional Floral Marigold Corner Garland Accent
const FloralCornerAccent = ({ position = 'top-left' }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]'
  };

  return (
    <svg
      viewBox="0 0 140 140"
      className={`pointer-events-none absolute w-24 h-24 sm:w-32 sm:h-32 opacity-85 ${positionClasses[position]}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Mango Leaf & Vine Swirl */}
      <path
        d="M0 0C45 5 85 28 115 65C90 35 55 15 0 18V0Z"
        fill="#2E4A24"
        fillOpacity="0.7"
      />
      <path
        d="M0 0C12 42 32 78 68 108C38 80 18 46 16 0H0Z"
        fill="#233B1B"
        fillOpacity="0.75"
      />
      {/* Traditional Marigold & Jasmine Blossoms */}
      <circle cx="24" cy="22" r="11" fill="#D97706" />
      <circle cx="24" cy="22" r="6" fill="#FBBF24" />
      <circle cx="52" cy="16" r="8" fill="#B45309" />
      <circle cx="52" cy="16" r="4" fill="#FDE68A" />
      <circle cx="16" cy="50" r="8" fill="#B45309" />
      <circle cx="16" cy="50" r="4" fill="#FDE68A" />
      <circle cx="78" cy="28" r="5" fill="#FFF0D5" />
      <circle cx="28" cy="76" r="5" fill="#FFF0D5" />
    </svg>
  );
};

export default function App() {
  const [authMode, setAuthMode] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [selectedHallForDetails, setSelectedHallForDetails] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'about' | 'facilities' | 'gallery' | 'events' | 'contact' | null
  const [hallsData, setHallsData] = useState(HALLS_DATA);
  const [facilitiesData, setFacilitiesData] = useState(FACILITIES_DATA);
  const [galleryItems, setGalleryItems] = useState([]);
  const [siteContent, setSiteContent] = useState({
    heroKicker: 'TRADITION • CULTURE • CELEBRATION',
    heroTagline: 'A Beautiful Place for Celebrations, Gatherings & Memories.',
    aboutTitle: 'A Landmark of Culture & Hospitality in Guruvayankere',
    aboutIntro: 'Buntara Bhavana – Guruvayankere stands as a proud symbol of Tulunadu cultural heritage, community unity, and gracious South Indian hospitality.',
    aboutDetails: 'Located in the heart of Guruvayankere, Belthangady Taluk, our venue brings families and communities together to celebrate life’s most cherished milestones.',
    facilitiesIntro: 'Buntara Bhavana – Guruvayankere offers the following confirmed halls and essential guest amenities:',
    eventsTitle: 'Auspicious Celebrations Hosted at Buntara Bhavana',
    contactAddress: 'Guruvayankere, Belthangady Taluk, Dakshina Kannada District, Karnataka',
    contactPhone: '+91 8256 232 456',
    contactEmail: 'office@buntarabhavanaguruvayankere.in',
    officeHours: '9:30 AM – 6:00 PM',
    events: [
      { title: 'Traditional Weddings & Receptions', desc: 'Grand Tulunadu and South Indian wedding ceremonies hosted with timeless elegance.' },
      { title: 'Engagements & Naming Ceremonies', desc: 'Intimate family milestones celebrated in our welcoming halls.' },
      { title: 'Cultural & Community Programs', desc: 'Yakshagana performances, cultural festivals, and community gatherings.' },
      { title: 'Conferences & Social Functions', desc: 'Well-organized conventions, felicitation ceremonies, and family reunions.' }
    ]
  });
  const [legacyEnquiries, setLegacyEnquiries] = useState([]);
  const [profileNotice, setProfileNotice] = useState('');
  const [siteError, setSiteError] = useState('');

  const handleAuthChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    setAuthError('');
    setAuthNotice('');
  };

  const loadSignedInProfile = async (authUser) => {
    if (!supabase || !authUser) return;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, email, phone, username, is_active')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error || !profile) {
      setAuthError(error?.message || 'Your profile could not be loaded. Please contact the venue administrator.');
      setCurrentUser(null);
      await supabase.auth.signOut();
      return;
    }

    if (!profile.is_active) {
      setAuthError('This account is currently disabled. Please contact the venue administrator.');
      setCurrentUser(null);
      await supabase.auth.signOut();
      return;
    }

    try {
      const oldUsers = JSON.parse(localStorage.getItem('bb_users') || '[]');
      const remainingUsers = oldUsers.filter(
        (user) => user.username?.toLowerCase() !== profile.username.toLowerCase()
      );
      if (remainingUsers.length !== oldUsers.length) {
        localStorage.setItem('bb_users', JSON.stringify(remainingUsers));
      }
      localStorage.removeItem('bb_current_user');
    } catch (storageError) {
      setSiteError(`Could not clean up the old local account data: ${storageError.message}`);
    }

    setCurrentUser({
      id: authUser.id,
      fullName: profile.full_name,
      email: profile.email || authUser.email,
      phone: profile.phone,
      username: profile.username
    });
  };

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;
    let requestId = 0;
    const syncSession = (session) => {
      const currentRequestId = ++requestId;
      if (!session) {
        setCurrentUser(null);
        return;
      }
      window.setTimeout(() => {
        if (active && currentRequestId === requestId) {
          void loadSignedInProfile(session.user);
        }
      }, 0);
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthError(error.message);
      syncSession(data.session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) syncSession(session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const fullName = authForm.fullName.trim();
    const email = authForm.email.trim().toLowerCase();
    const phone = authForm.phone.trim();
    const username = authForm.username.trim().toLowerCase();
    const password = authForm.password;

    if (!fullName || !email || !phone || !username || !password) {
      setAuthError('Please complete all registration fields.');
      return;
    }

    if (fullName.length < 2 || fullName.length > 100) {
      setAuthError('Enter a full name between 2 and 100 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Enter a valid email address.');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^\+?[0-9\s()-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setAuthError('Enter a valid phone number with 7 to 15 digits.');
      return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      setAuthError('Username must be 3–30 characters and use only letters, numbers, dots, underscores, or hyphens.');
      return;
    }

    if (password.length < 8) {
      setAuthError('Password must contain at least 8 characters.');
      return;
    }

    if (!supabase) {
      setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and a publishable/anon key to .env.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone, username } }
    });
    if (error) {
      setAuthError(
        error.code === '23505' || error.message.includes('profiles_username_ci_unique')
          ? 'That username is already in use. Choose another username.'
          : error.message
      );
      return;
    }

    if (data.user?.identities?.length === 0) {
      setAuthError('An account with this email already exists. Please sign in instead.');
      return;
    }

    if (!data.session) {
      setAuthNotice('Account created. Check your email to confirm the account, then sign in.');
    } else {
      setAuthNotice('Your profile has been created.');
    }
    setAuthForm({ fullName: '', email: '', phone: '', username: '', password: '' });
    setAuthError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!email || !password) {
      setAuthError('Please enter your email and password.');
      return;
    }

    if (!supabase) {
      setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and a publishable/anon key to .env.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setAuthError('');
  };

  const handleLogout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) setAuthError(error.message);
    }
    setCurrentUser(null);
    setProfileMenuOpen(false);
    setAuthMode('login');
    setAuthForm({ fullName: '', email: '', phone: '', username: '', password: '' });
  };

  // Optional local file overrides so user can load their 4 photos directly in browser preview if needed
  const [customPhotos, setCustomPhotos] = useState({
    hero: null,
    'malady-tunga': null,
    'kaashi-shetty': null,
    'arvaguthu-mini': null
  });

  const handlePhotoUpload = (key, file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCustomPhotos((prev) => ({ ...prev, [key]: objectUrl }));
  };

  // Approved bookings are loaded from Supabase to keep availability shared.
  const [approvedBookings, setApprovedBookings] = useState([]);

  // Submitted booking enquiries are stored in the shared Supabase database.
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    if (!supabase) {
      setEnquiries([]);
      setApprovedBookings([]);
      setLegacyEnquiries([]);
      return;
    }

    let active = true;
    const loadSiteData = async () => {
      setSiteError('');
      const bookingRequest = currentUser
        ? supabase.from('booking_enquiries').select('*').eq('profile_id', currentUser.id).order('submitted_at', { ascending: false })
        : Promise.resolve({ data: [], error: null });
      const availabilityRequest = supabase.rpc('get_approved_booking_slots');
      const [hallResult, contentResult, galleryResult, bookingResult, approvedResult] = await Promise.all([
        supabase.from('venue_halls').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_content').select('content').eq('id', 'public').maybeSingle(),
        supabase.from('gallery_items').select('id, title, image_url').order('display_order'),
        bookingRequest,
        availabilityRequest
      ]);

      const failedResult = [hallResult, contentResult, galleryResult, bookingResult, approvedResult]
        .find((result) => result.error);
      if (failedResult?.error) {
        if (active) setSiteError(failedResult.error.message);
        return;
      }

      if (!active) return;
      const mappedHalls = (hallResult.data || []).map((hall) => {
        const fallback = HALLS_DATA.find((item) => item.id === hall.id) || {};
        return {
          ...fallback,
          ...hall,
          formattedPrice: `₹${Number(hall.price).toLocaleString('en-IN')}`,
          image: hall.image_url || fallback.image,
          timings: hall.details?.timings || fallback.timings,
          highlights: hall.details?.highlights || fallback.highlights || [],
          suitableEvents: hall.details?.suitableEvents || fallback.suitableEvents || [],
          structuredFacilities: hall.details?.structuredFacilities || fallback.structuredFacilities || []
        };
      });
      setHallsData(mappedHalls);
      if (contentResult.data?.content) {
        const savedContent = contentResult.data.content;
        setSiteContent((current) => ({ ...current, ...savedContent }));
        if (Array.isArray(savedContent.facilities)) {
          setFacilitiesData(savedContent.facilities.map((facility) => ({
            ...facility,
            icon: FACILITIES_DATA.find((item) => item.id === facility.id)?.icon || Building2
          })));
        }
      }
      setGalleryItems(galleryResult.data || []);
      setEnquiries((bookingResult.data || []).map((booking) => ({
        id: booking.reference_code,
        ...booking,
        hallId: booking.hall_id,
        hallName: booking.hall_name,
        hallCategory: booking.hall_category,
        rentalPrice: booking.rental_price,
        eventType: booking.event_type,
        eventDate: booking.event_date,
        numberOfGuests: booking.number_of_guests,
        additionalMessage: booking.additional_message,
        submittedAt: new Date(booking.submitted_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
      })));
      setApprovedBookings((approvedResult.data || []).map((booking) => ({
        hallId: booking.hall_id,
        date: booking.event_date,
        session: booking.session
      })));

      if (!currentUser) {
        setLegacyEnquiries([]);
      } else {
        const importedKey = `bb_legacy_imported_${currentUser.id}`;
        const legacyKey = `bb_enquiries_${currentUser.username}`;
        if (localStorage.getItem(importedKey)) {
          setLegacyEnquiries([]);
        } else {
          try {
            setLegacyEnquiries(JSON.parse(localStorage.getItem(legacyKey) || '[]'));
          } catch {
            setLegacyEnquiries([]);
            setSiteError('Old local booking history could not be read for import.');
          }
        }
      }
    };

    void loadSiteData();
    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleImportLegacyEnquiries = async () => {
    if (!supabase || !currentUser || legacyEnquiries.length === 0) return;
    setSiteError('');
    const supportedHalls = new Set(hallsData.map((hall) => hall.id));
    const bookingsToImport = legacyEnquiries
      .filter((item) => supportedHalls.has(item.hallId))
      .map((item, index) => ({
        reference_code: `LEG-${currentUser.id.slice(0, 8)}-${index + 1}`,
        profile_id: currentUser.id,
        customer_name: item.customerName || currentUser.fullName,
        mobile_number: item.mobileNumber || currentUser.phone,
        email_address: item.emailAddress || currentUser.email,
        hall_id: item.hallId,
        hall_name: item.hallName,
        hall_category: item.hallCategory || '',
        rental_price: item.rentalPrice || '',
        event_type: item.eventType || 'Event',
        event_date: item.eventDate,
        session: item.session || 'Morning Session',
        number_of_guests: Number(item.numberOfGuests) || null,
        additional_message: item.additionalMessage || '',
        status: 'pending',
        legacy_reference: String(item.id || `legacy-${index + 1}`)
      }));

    if (bookingsToImport.length !== legacyEnquiries.length) {
      setSiteError('Some old booking requests refer to halls that are unavailable. No history was imported; contact the administrator for help.');
      return;
    }

    const { error } = await supabase.from('booking_enquiries').insert(bookingsToImport);
    if (error) {
      setSiteError(error.message);
      return;
    }

    localStorage.setItem(`bb_legacy_imported_${currentUser.id}`, 'true');
    setLegacyEnquiries([]);
    setProfileNotice('Your previous booking requests were imported as pending enquiries for administrator review.');
    const { data, error: reloadError } = await supabase
      .from('booking_enquiries')
      .select('*')
      .eq('profile_id', currentUser.id)
      .order('submitted_at', { ascending: false });
    if (reloadError) {
      setSiteError(reloadError.message);
      return;
    }
    setEnquiries((data || []).map((booking) => ({
      id: booking.reference_code,
      ...booking,
      hallId: booking.hall_id,
      hallName: booking.hall_name,
      eventType: booking.event_type,
      eventDate: booking.event_date,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    })));
  };

  // Booking Form State (including Morning / Evening / Full-day session selection)
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    mobileNumber: '',
    emailAddress: '',
    hallId: 'malady-tunga',
    eventType: 'Wedding',
    eventDate: '',
    session: 'Morning Session',
    numberOfGuests: '',
    additionalMessage: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Inject Google Fonts for authentic South Indian luxury serif typography
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Subtle auto-advance for hero indicators
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  const selectedHallObj =
    hallsData.find((h) => h.id === bookingForm.hallId) || hallsData[0] || HALLS_DATA[0];

  useEffect(() => {
    if (!currentUser) return;
    setBookingForm((prev) => ({
      ...prev,
      customerName: prev.customerName || currentUser.fullName || '',
      mobileNumber: prev.mobileNumber || currentUser.phone || '',
      emailAddress: prev.emailAddress || currentUser.email || ''
    }));
  }, [currentUser]);

  // Open Booking Modal with optional pre-selected hall
  const handleOpenBooking = (hallId = 'malady-tunga') => {
    setProfileMenuOpen(false);
    setBookingForm((prev) => ({
      ...prev,
      hallId: hallId || 'malady-tunga'
    }));
    setBookingError('');
    setBookingSuccessData(null);
    setSelectedHallForDetails(null);
    setActiveInfoModal(null);
    setBookingModalOpen(true);
    setMobileMenuOpen(false);
  };

  // Handle Top Navigation Link Clicks
  const handleNavClick = (navItem) => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    switch (navItem) {
      case 'HOME':
        setActiveInfoModal(null);
        setSelectedHallForDetails(null);
        setBookingModalOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'OUR HALLS': {
        setActiveInfoModal(null);
        const el = document.getElementById('our-halls-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'BOOKING':
        handleOpenBooking('malady-tunga');
        break;
      case 'ABOUT':
        setActiveInfoModal('about');
        break;
      case 'FACILITIES':
        setActiveInfoModal('facilities');
        break;
      case 'GALLERY':
        setActiveInfoModal('gallery');
        break;
      case 'EVENTS':
        setActiveInfoModal('events');
        break;
      case 'CONTACT':
        setActiveInfoModal('contact');
        break;
      default:
        break;
    }
  };

  // Validate and submit booking enquiry with date & session double-booking check
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (
      !bookingForm.customerName.trim() ||
      !bookingForm.mobileNumber.trim() ||
      !bookingForm.eventDate
    ) {
      setBookingError(
        'Please complete your Name, Mobile Number, and Preferred Event Date.'
      );
      return;
    }

    const customerName = bookingForm.customerName.trim();
    const mobileNumber = bookingForm.mobileNumber.trim();
    const emailAddress = bookingForm.emailAddress.trim();
    const phoneDigits = mobileNumber.replace(/\D/g, '');
    if (customerName.length < 2 || customerName.length > 100) {
      setBookingError('Enter a name between 2 and 100 characters.');
      return;
    }
    if (!/^\+?[0-9\s()-]+$/.test(mobileNumber) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setBookingError('Enter a valid phone number with 7 to 15 digits.');
      return;
    }
    if (emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      setBookingError('Enter a valid email address or leave the email field blank.');
      return;
    }

    if (!supabase) {
      setBookingError('Online booking is unavailable until Supabase is configured. Please contact the venue directly.');
      return;
    }

    if (!hallsData.some((hall) => hall.id === bookingForm.hallId)) {
      setBookingError('This hall is no longer available for booking. Please refresh the page and choose an active hall.');
      return;
    }

    // Prevent double-booking of the same hall for an already approved date & overlapping session
    const isAlreadyApproved = approvedBookings.some((b) => {
      if (b.hallId !== bookingForm.hallId || b.date !== bookingForm.eventDate) {
        return false;
      }
      if (
        b.session === 'Full-Day Session' ||
        bookingForm.session === 'Full-Day Session' ||
        b.session === bookingForm.session
      ) {
        return true;
      }
      return false;
    });

    if (isAlreadyApproved) {
      setBookingError(
        `${selectedHallObj.name} is already booked and approved for ${bookingForm.eventDate} (${bookingForm.session}). Please choose another session, date, or check availability for our other halls.`
      );
      return;
    }

    const referenceCode = `BB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await supabase
      .from('booking_enquiries')
      .insert({
        reference_code: referenceCode,
        profile_id: currentUser?.id ?? null,
        customer_name: customerName,
        mobile_number: mobileNumber,
        email_address: emailAddress || currentUser?.email || '',
        hall_id: bookingForm.hallId,
        hall_name: selectedHallObj.name,
        hall_category: selectedHallObj.category,
        rental_price: selectedHallObj.formattedPrice,
        event_type: bookingForm.eventType,
        event_date: bookingForm.eventDate,
        session: bookingForm.session,
        number_of_guests: Number(bookingForm.numberOfGuests) || null,
        additional_message: bookingForm.additionalMessage.trim()
      });

    if (error) {
      setBookingError(
        error.code === '42501'
          ? 'Guest booking is not enabled in the database yet. Apply the updated Supabase migration and try again.'
          : error.message
      );
      return;
    }

    const newEnquiry = {
      ...bookingForm,
      id: referenceCode,
      hallName: selectedHallObj.name,
      hallCategory: selectedHallObj.category,
      rentalPrice: selectedHallObj.formattedPrice,
      status: 'Pending',
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    if (currentUser) setEnquiries((prev) => [newEnquiry, ...prev]);
    setBookingSuccessData(newEnquiry);
  };

  // Real-time availability check for selected hall + date + session
  const selectedSlotStatus = (() => {
    if (!bookingForm.eventDate) return null;
    const conflict = approvedBookings.some((b) => {
      if (b.hallId !== bookingForm.hallId || b.date !== bookingForm.eventDate) {
        return false;
      }
      return (
        b.session === 'Full-Day Session' ||
        bookingForm.session === 'Full-Day Session' ||
        b.session === bookingForm.session
      );
    });
    return conflict ? 'unavailable' : 'available';
  })();

  const renderFacilityBadgeIcon = (iconKey) => {
    switch (iconKey) {
      case 'dining':
        return <Utensils className="w-4 h-4 text-[#C99A43]" />;
      case 'lift':
        return <ArrowUpDown className="w-4 h-4 text-[#C99A43]" />;
      case 'parking':
        return <Car className="w-4 h-4 text-[#C99A43]" />;
      case 'ventilation':
        return <Wind className="w-4 h-4 text-[#C99A43]" />;
      case 'interiors':
      default:
        return <Landmark className="w-4 h-4 text-[#C99A43]" />;
    }
  };

  const currentHero = {
    ...HERO_SLIDES[activeHeroSlide],
    kicker: siteContent.heroKicker,
    tagline: siteContent.heroTagline
  };
  const currentUserInitial = currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U';

  const authDialog = authModalOpen && !currentUser ? (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="customer-auth-title">
        <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#C99A43]/40 bg-[#FFF0D5]/95 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div className="mb-6 flex justify-center">
            <div className="relative flex w-full justify-center">
              <TempleLogoSVG />
              <button
                type="button"
                onClick={() => { setAuthModalOpen(false); setAuthError(''); setAuthNotice(''); }}
                className="absolute right-0 top-0 rounded-full p-2 text-[#741B1B] hover:bg-[#F8E7C8]"
                aria-label="Close sign in"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#A64B2A]" style={{ fontFamily: "'Cinzel', serif" }}>
              Welcome
            </p>
            <h1 id="customer-auth-title" className="mt-3 text-3xl font-bold text-[#5A1015]" style={{ fontFamily: "'Cinzel', serif" }}>
              BUNTARA BHAVANA
            </h1>
            <p className="mt-2 text-sm text-[#6B3A2B]">Create your profile to book halls and manage your booking history</p>
          </div>

          {!isSupabaseConfigured && (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Account sign-in and booking submission are unavailable until Supabase is configured.
            </p>
          )}

          <div className="mt-7 flex rounded-full border border-[#C99A43] bg-[#F8E7C8] p-1">
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthNotice(''); }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                authMode === 'register' ? 'bg-[#5A1015] text-[#FFF0D5]' : 'text-[#5A1015]'
              }`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthNotice(''); }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                authMode === 'login' ? 'bg-[#5A1015] text-[#FFF0D5]' : 'text-[#5A1015]'
              }`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Login
            </button>
          </div>

          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Full Name</label>
                <input
                  type="text"
                  value={authForm.fullName}
                  onChange={(e) => handleAuthChange('fullName', e.target.value)}
                  className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => handleAuthChange('email', e.target.value)}
                    className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Phone</label>
                  <input
                    type="tel"
                    value={authForm.phone}
                    onChange={(e) => handleAuthChange('phone', e.target.value)}
                    className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Username</label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => handleAuthChange('username', e.target.value)}
                  className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                  className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                  placeholder="Create a password"
                />
              </div>

              {authError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</p>
              )}
              {authNotice && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{authNotice}</p>
              )}

              <button
                type="submit"
                disabled={!isSupabaseConfigured}
                className="w-full rounded-xl bg-[#5A1015] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF0D5] shadow-lg shadow-[#5A1015]/25 hover:bg-[#741B1B]"
              >
                Create My Profile
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => handleAuthChange('email', e.target.value)}
                  className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5A1015]">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                  className="w-full rounded-xl border border-[#C99A43] bg-white px-3 py-3 text-[#2F1A12] outline-none placeholder:text-[#9F7F67]"
                  placeholder="Enter your password"
                />
              </div>

              {authError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</p>
              )}
              {authNotice && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{authNotice}</p>
              )}

              <button
                type="submit"
                disabled={!isSupabaseConfigured}
                className="w-full rounded-xl bg-[#5A1015] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF0D5] shadow-lg shadow-[#5A1015]/25 hover:bg-[#741B1B]"
              >
                Sign In
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-[#6B3A2B]">
            Already have a profile? Switch to <button type="button" onClick={() => setAuthMode('login')} className="font-semibold text-[#5A1015] underline">Login</button>
          </p>
          <p className="mt-3 text-center text-xs text-[#6B3A2B]">
            Venue staff? <a href="/admin" className="font-semibold text-[#5A1015] underline">Administrator sign in</a>
          </p>
        </div>
      </div>
    ) : null;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFF0D5] text-[#48251B] selection:bg-[#741B1B] selection:text-[#FFF0D5] overflow-x-hidden"
      style={{ fontFamily: "'Lora', Georgia, serif" }}
    >
      {authDialog}
      {siteError && (
        <div role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-800">
          Could not load shared venue data: {siteError}
        </div>
      )}
      {/* =====================================================================
          1. TOP INFORMATION BAR (Dark Maroon #5A1015)
         ===================================================================== */}
      <div className="bg-[#5A1015] text-[#FFF0D5] border-b border-[#C99A43]/35 text-xs sm:text-[13px] tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          {/* Left Side */}
          <div className="flex items-center gap-2 font-medium text-[#F8E7C8]">
            <span className="text-[#C99A43]">✦</span>
            <span tracking-widest="true" className="uppercase tracking-[0.14em] text-[11px] sm:text-xs">
              Tradition • Culture • Celebration
            </span>
            <span className="text-[#C99A43]">✦</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-4 text-[#FFF0D5]/95">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C99A43] shrink-0" />
              <span>Guruvayankere</span>
            </span>
            <span className="text-[#C99A43]/60" aria-hidden="true">
              |
            </span>
            <a
            href={`tel:${String(siteContent.contactPhone).replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-[#C99A43] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C99A43] shrink-0" />
            <span>{siteContent.contactPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. MAIN NAVIGATION BAR (Warm Cream #FFF0D5 / Ivory #F8E7C8)
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFF0D5]/95 backdrop-blur-sm border-b-2 border-[#C99A43] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-22">
            {/* Left Side: Temple Logo + BUNTARA BHAVANA / GURUVAYANKERE */}
            <button
              onClick={() => handleNavClick('HOME')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <TempleLogoSVG />
              <div className="flex flex-col">
                <span
                  className="text-lg sm:text-xl md:text-[22px] font-bold tracking-[0.06em] text-[#741B1B] leading-tight group-hover:text-[#5A1015] transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BUNTARA BHAVANA
                </span>
                <span
                  className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-[#A64B2A] uppercase mt-0.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  GURUVAYANKERE
                </span>
              </div>
            </button>

            {/* Desktop Horizontal Navigation Links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden xl:flex items-center gap-1"
            >
              {[
                'HOME',
                'ABOUT',
                'OUR HALLS',
                'FACILITIES',
                'GALLERY',
                'EVENTS',
                'BOOKING',
                'CONTACT'
              ].map((link, idx, arr) => (
                <React.Fragment key={link}>
                  <button
                    onClick={() => handleNavClick(link)}
                    className="px-2.5 py-1.5 text-[12.5px] font-semibold tracking-[0.08em] text-[#48251B] hover:text-[#741B1B] transition-colors relative group"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {link}
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#C99A43] scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="text-[#C99A43]/60 text-xs select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Right Side: Profile Menu + BOOK NOW Button + Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#C99A43] bg-[#5A1015] text-[#FFF0D5] shadow-sm transition hover:bg-[#741B1B] focus:outline-none focus:ring-2 focus:ring-[#C99A43] focus:ring-offset-2"
                  aria-label="Open your profile and bookings"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <UserRound className="h-5 w-5" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#C99A43] bg-[#FFF0D5] shadow-2xl">
                    {currentUser ? (
                      <>
                    <div className="flex items-center gap-3 border-b border-[#C99A43]/50 bg-[#F8E7C8] p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5A1015] text-lg font-bold text-[#FFF0D5]">
                        {currentUserInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#5A1015]">{currentUser?.fullName}</p>
                        <p className="truncate text-xs text-[#A64B2A]">@{currentUser?.username}</p>
                      </div>
                    </div>

                    <div className="space-y-1 px-4 py-3 text-sm text-[#48251B]">
                      <p className="break-all"><span className="font-semibold">Email:</span> {currentUser?.email}</p>
                      <p><span className="font-semibold">Phone:</span> {currentUser?.phone}</p>
                    </div>

                    <div className="border-t border-[#C99A43]/50 px-4 py-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold text-[#5A1015]" style={{ fontFamily: "'Cinzel', serif" }}>
                          My Bookings
                        </h3>
                        <span className="rounded-full bg-[#741B1B] px-2 py-0.5 text-xs font-semibold text-[#FFF0D5]">
                          {enquiries.length}
                        </span>
                      </div>
                      {enquiries.length === 0 ? (
                        <p className="rounded-lg bg-white/70 p-3 text-xs text-[#6B5144]">
                          Your booking enquiries will appear here after you submit one.
                        </p>
                      ) : (
                        <div className="max-h-56 space-y-2 overflow-y-auto">
                          {enquiries.map((enquiry) => (
                            <div key={enquiry.id} className="rounded-lg border border-[#C99A43]/50 bg-white/70 p-3 text-xs">
                              <p className="font-semibold leading-snug text-[#5A1015]">{enquiry.hallName}</p>
                              <p className="mt-1 text-[#48251B]">
                                {enquiry.eventType} · {enquiry.eventDate} · {enquiry.session}
                              </p>
                              <p className="mt-1 text-[#A64B2A]">
                                Ref: {enquiry.id} · {enquiry.status}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {legacyEnquiries.length > 0 && (
                      <button
                        type="button"
                        onClick={handleImportLegacyEnquiries}
                        className="w-full border-t border-[#C99A43]/50 px-4 py-3 text-left text-sm font-semibold text-[#741B1B] hover:bg-[#F8E7C8]"
                      >
                        Import {legacyEnquiries.length} previous booking request{legacyEnquiries.length === 1 ? '' : 's'}
                      </button>
                    )}
                    {profileNotice && (
                      <p role="status" className="border-t border-[#C99A43]/50 bg-emerald-50 px-4 py-2 text-xs text-emerald-900">
                        {profileNotice}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-[#C99A43]/50 px-4 py-3 text-left text-sm font-semibold text-[#741B1B] transition hover:bg-[#F8E7C8]"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                      </>
                    ) : (
                      <div className="p-4">
                        <p className="font-semibold text-[#5A1015]">Welcome to Buntara Bhavana</p>
                        <p className="mt-1 text-sm text-[#6B5144]">Sign in to view your profile and booking history, or create an account when you are ready to book.</p>
                        <button
                          type="button"
                          onClick={() => { setProfileMenuOpen(false); setAuthMode('login'); setAuthError(''); setAuthNotice(''); setAuthModalOpen(true); }}
                          className="mt-4 w-full rounded-lg bg-[#5A1015] px-4 py-2.5 text-sm font-semibold text-[#FFF0D5] hover:bg-[#741B1B]"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => { setProfileMenuOpen(false); setAuthMode('register'); setAuthError(''); setAuthNotice(''); setAuthModalOpen(true); }}
                          className="mt-2 w-full rounded-lg border border-[#C99A43] px-4 py-2.5 text-sm font-semibold text-[#5A1015] hover:bg-[#F8E7C8]"
                        >
                          Create Profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenBooking('malady-tunga')}
                className="inline-flex items-center gap-2 bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold tracking-[0.1em] shadow-md hover:shadow-lg transition-all cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Calendar className="w-4 h-4 text-[#C99A43]" />
                <span>BOOK NOW</span>
              </button>

              {/* Mobile / Tablet Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-lg border border-[#C99A43]/60 text-[#741B1B] hover:bg-[#F8E7C8] transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#F8E7C8] border-t border-[#C99A43] px-4 pt-3 pb-5 shadow-inner">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'HOME',
                'ABOUT',
                'OUR HALLS',
                'FACILITIES',
                'GALLERY',
                'EVENTS',
                'BOOKING',
                'CONTACT'
              ].map((link) => (
                <button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  className="text-left px-3 py-2.5 rounded-md text-xs font-bold tracking-[0.08em] text-[#741B1B] hover:bg-[#FFF0D5] border border-transparent hover:border-[#C99A43]/50 transition-all"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          3. HERO BANNER – MAIN ATTRACTION
         ===================================================================== */}
      <section className="relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] flex items-center overflow-hidden border-b-4 border-[#C99A43]">
        {/* Full-Width Venue Exterior Background Photograph (1st pic: main pic.jpg) */}
        <VenueImage
          src={currentHero.image}
          fallbacks={currentHero.fallbackImages}
          customSrc={customPhotos.hero}
          variant="exterior"
          alt="Buntara Bhavana Guruvayankere Exterior"
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000"
        />

        {/* Subtle Dark Maroon-Brown Gradient Overlay for Crisp Readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(46, 12, 14, 0.90) 0%, rgba(74, 18, 20, 0.78) 48%, rgba(38, 14, 10, 0.55) 100%)'
          }}
        />

        {/* Natural Greenery & Marigold Floral Corner Framing */}
        <FloralCornerAccent position="top-left" />
        <FloralCornerAccent position="top-right" />
        <FloralCornerAccent position="bottom-left" />
        <FloralCornerAccent position="bottom-right" />

        {/* Subtle Gold Inner Frame Border */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-[#C99A43]/35 rounded-sm" />

        {/* Hero Left-Aligned Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-14 py-14 sm:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-10 max-w-4xl">
            {/* Traditional Brass Nilavilakku Lamp Decoration on the Left */}
            <div className="hidden sm:flex flex-col items-center shrink-0">
              <NilavilakkuLampSVG className="w-16 h-44 lg:w-20 lg:h-52 drop-shadow-[0_0_18px_rgba(201,154,67,0.45)]" />
            </div>

            {/* Main Left-Aligned Typography & CTA Buttons */}
            <div className="text-left">
              {/* Top Kicker with Gold Decorative Lines */}
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[1.5px] w-8 sm:w-12 bg-[#C99A43]" />
                <p
                  className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#F3CF7A] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {currentHero.kicker}
                </p>
                <span className="h-[1.5px] w-8 sm:w-12 bg-[#C99A43]" />
              </div>

              {/* Large White Serif Main Heading */}
              <h1
                className="text-3xl sm:text-5xl lg:text-[58px] font-bold text-white tracking-[0.05em] leading-[1.12] drop-shadow-md"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {currentHero.title}
              </h1>

              {/* Gold-Highlighted Location Text */}
              <div className="mt-2.5 sm:mt-3 flex items-center gap-3">
                <p
                  className="text-base sm:text-xl lg:text-2xl font-bold text-[#C99A43] tracking-[0.34em] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {currentHero.location}
                </p>
              </div>

              {/* Gold Decorative Rule */}
              <div className="w-44 sm:w-64 h-[1.5px] bg-gradient-to-r from-[#C99A43] via-[#F3CF7A] to-transparent my-4 sm:my-5" />

              {/* Tagline */}
              <p
                className="text-lg sm:text-2xl text-[#FFF0D5] italic font-medium max-w-2xl leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {currentHero.tagline}
              </p>

              {/* Two Attractive Maroon & Gold CTA Buttons */}
              <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleNavClick('OUR HALLS')}
                  className="px-6 sm:px-7 py-3.5 rounded-md bg-[#C99A43] hover:bg-[#d8aa52] text-[#48251B] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase shadow-lg border border-[#FFF0D5]/40 transition-all cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  EXPLORE OUR HALLS
                </button>

                <button
                  onClick={() => handleOpenBooking('malady-tunga')}
                  className="px-6 sm:px-7 py-3.5 rounded-md bg-[#741B1B]/95 hover:bg-[#5A1015] text-[#FFF0D5] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase shadow-lg border-2 border-[#C99A43] transition-all cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BOOK YOUR CELEBRATION
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Three Small Carousel Indicators at Bottom Centre */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-[#5A1015]/70 px-3.5 py-1.5 rounded-full border border-[#C99A43]/40"
          role="tablist"
          aria-label="Hero Banner Slides"
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveHeroSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all rounded-full cursor-pointer ${
                activeHeroSlide === idx
                  ? 'w-7 h-2.5 bg-[#C99A43]'
                  : 'w-2.5 h-2.5 bg-[#FFF0D5]/60 hover:bg-[#FFF0D5]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. THREE DISTINCTIVE SPACES – MOST IMPORTANT CONTENT SECTION
         ===================================================================== */}
      <main id="our-halls-section" className="relative py-14 sm:py-20 bg-[#FFF0D5]">
        {/* Subtle Traditional Kolam / Temple Diamond Motif Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'radial-gradient(#741B1B 1.25px, transparent 1.25px), radial-gradient(#C99A43 1.25px, #FFF0D5 1.25px)',
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading with Flanking Gold Ornamental Dividers */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              <GoldOrnamentalDivider />
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#741B1B] tracking-[0.08em] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {siteContent.hallsTitle || 'THREE DISTINCTIVE SPACES'}
              </h2>
              <GoldOrnamentalDivider flip />
            </div>

            <p
              className="mt-2.5 text-lg sm:text-2xl italic text-[#A64B2A] font-medium"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {siteContent.hallsSubtitle || 'One Place for Every Celebration'}
            </p>
          </div>

          {/* Three Hall Cards Displayed Horizontally in One Row on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch">
            {hallsData.map((hall) => (
              <article
                key={hall.id}
                className="flex flex-col bg-[#F8E7C8] rounded-xl border-2 border-[#C99A43] shadow-[0_8px_24px_rgba(72,37,27,0.10)] hover:shadow-[0_14px_32px_rgba(116,27,27,0.18)] transition-all duration-300 overflow-hidden group"
              >
                {/* Large Actual Hall Photograph at the Top */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden border-b-2 border-[#C99A43]">
                  <VenueImage
                    src={hall.image}
                    fallbacks={hall.fallbackImages}
                    customSrc={customPhotos[hall.id]}
                    variant="hall"
                    alt={hall.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#48251B]/55 via-transparent to-transparent pointer-events-none" />

                  {/* Category Badge */}
                  <span
                    className="absolute top-3.5 right-3.5 px-3.5 py-1 rounded-full bg-[#741B1B] text-[#FFF0D5] border border-[#C99A43] text-[11px] font-bold tracking-[0.14em] uppercase shadow-md"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {hall.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div>
                    {/* Official Hall Name */}
                    <h3
                      className="text-lg sm:text-[19px] font-bold text-[#48251B] tracking-[0.03em] leading-snug min-h-[52px]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {hall.name}
                    </h3>

                    {/* Gold Divider Line */}
                    <div className="w-16 h-[1.5px] bg-[#C99A43] my-3" />

                    {/* Rental Price Prominently Displayed in Bold Maroon Typography */}
                    <div className="flex items-baseline gap-2 mb-3.5">
                      <span
                        className="text-2xl sm:text-3xl font-extrabold text-[#741B1B]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {hall.formattedPrice}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-[#A64B2A] font-semibold">
                        / Per Day Rental
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm sm:text-[15px] text-[#48251B]/90 leading-relaxed">
                      {hall.description}
                    </p>
                  </div>

                  {/* Two Action Buttons: EXPLORE HALL & BOOK THIS HALL */}
                  <div className="mt-6 pt-4 border-t border-[#C99A43]/40 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedHallForDetails(hall)}
                      className="py-2.5 px-3 rounded-md bg-[#FFF0D5] hover:bg-[#C99A43]/25 text-[#741B1B] border border-[#741B1B] font-bold text-[11.5px] tracking-[0.08em] uppercase transition-colors cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      EXPLORE HALL
                    </button>

                    <button
                      onClick={() => handleOpenBooking(hall.id)}
                      className="py-2.5 px-3 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] font-bold text-[11.5px] tracking-[0.08em] uppercase shadow-sm transition-colors cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      BOOK THIS HALL
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* =====================================================================
          5. BOTTOM CULTURAL HIGHLIGHT STRIP & MAROON PROMOTIONAL BANNER
         ===================================================================== */}
      <section className="relative bg-[#F8E7C8] border-t-2 border-b-4 border-[#C99A43] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side: Four Cultural Highlights with Maroon Icons */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  label: 'Rich Cultural Heritage',
                  icon: Landmark
                },
                {
                  label: 'Community Tradition',
                  icon: HeartHandshake
                },
                {
                  label: 'Premium Experience',
                  icon: Award
                },
                {
                  label: 'For Every Occasion',
                  icon: Sparkles
                }
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-3.5 rounded-lg bg-[#FFF0D5] border border-[#C99A43]/80 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-full bg-[#741B1B] text-[#C99A43] border border-[#C99A43] flex items-center justify-center mb-2.5 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-xs sm:text-[13px] font-bold text-[#48251B] leading-snug"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Side: Deep Maroon Promotional Banner with Gold Borders */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#741B1B] text-[#FFF0D5] p-6 sm:p-7 rounded-xl border-2 border-[#C99A43] shadow-lg text-center">
                <div className="pointer-events-none absolute inset-1.5 border border-[#C99A43]/45 rounded-lg" />
                <p
                  className="text-lg sm:text-xl font-bold text-[#FFF0D5] tracking-wide leading-snug"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  &ldquo;Celebrate Life&apos;s Special Moments at Buntara Bhavana&rdquo;
                </p>
                <div className="mt-3 flex justify-center">
                  <GoldOrnamentalDivider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MODAL A: EXPLORE HALL DETAILED VIEW (Tailored for Each of the 3 Halls)
         ===================================================================== */}
      {selectedHallForDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl bg-[#FFF0D5] border-2 border-[#C99A43] rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="relative h-64 sm:h-72 w-full border-b-2 border-[#C99A43]">
              <VenueImage
                src={selectedHallForDetails.image}
                fallbacks={selectedHallForDetails.fallbackImages}
                customSrc={customPhotos[selectedHallForDetails.id]}
                variant="hall"
                alt={selectedHallForDetails.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedHallForDetails(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] hover:bg-[#741B1B] cursor-pointer"
                aria-label="Close Hall Details"
              >
                <X className="w-5 h-5" />
              </button>
              <span
                className="absolute bottom-3.5 left-4 px-3.5 py-1 rounded-full bg-[#741B1B] text-[#FFF0D5] border border-[#C99A43] text-xs font-bold tracking-[0.14em]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {selectedHallForDetails.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
              <h3
                className="text-xl sm:text-2xl font-bold text-[#741B1B] tracking-wide"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {selectedHallForDetails.name}
              </h3>

              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span
                  className="text-2xl sm:text-3xl font-extrabold text-[#48251B]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {selectedHallForDetails.formattedPrice}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A64B2A]">
                  Official Hall Rental
                </span>
              </div>

              <p className="mt-4 text-[#48251B] leading-relaxed">
                {selectedHallForDetails.description}
              </p>

              {/* Dedicated Structured Facilities Grid for Kaashi Shetty Vedike (Non-AC Hall) */}
              {selectedHallForDetails.structuredFacilities && (
                <div className="mt-5">
                  <h4
                    className="text-xs font-bold uppercase tracking-[0.12em] text-[#741B1B] mb-3"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Confirmed Hall Facilities (Non-AC &amp; Naturally Ventilated)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedHallForDetails.structuredFacilities.map((fac) => (
                      <div
                        key={fac.title}
                        className="p-3.5 rounded-lg bg-[#F8E7C8] border border-[#C99A43]/80 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#741B1B] border border-[#C99A43] flex items-center justify-center shrink-0 mt-0.5">
                          {renderFacilityBadgeIcon(fac.icon)}
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold text-[#741B1B]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {fac.title}
                          </p>
                          <p className="text-xs text-[#48251B]/90 mt-0.5 leading-relaxed">
                            {fac.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Venue Highlights */}
              <div className="mt-5 bg-[#F8E7C8] p-4 rounded-lg border border-[#C99A43]/60">
                <h4
                  className="text-xs font-bold uppercase tracking-[0.12em] text-[#741B1B] mb-2.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Key Venue Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#48251B]">
                  {selectedHallForDetails.highlights.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="text-[#741B1B] font-bold">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suitable Functions / Events */}
              {selectedHallForDetails.suitableEvents && (
                <div className="mt-4 bg-[#F8E7C8]/70 p-4 rounded-lg border border-[#C99A43]/50">
                  <h4
                    className="text-xs font-bold uppercase tracking-[0.12em] text-[#741B1B] mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Suitable Functions &amp; Occasions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHallForDetails.suitableEvents.map((ev) => (
                      <span
                        key={ev}
                        className="px-3 py-1 rounded-full bg-[#FFF0D5] border border-[#C99A43] text-xs font-medium text-[#48251B]"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hall Timings Box (Displayed for Halls with Session Schedules) */}
              {selectedHallForDetails.timings && (
                <div className="mt-4 p-4 rounded-lg bg-[#741B1B] text-[#FFF0D5] border border-[#C99A43]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-[#C99A43]" />
                    <h4
                      className="text-xs font-bold uppercase tracking-[0.14em] text-[#C99A43]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Hall Booking Timings
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold">
                    <span>• {selectedHallForDetails.timings.morning}</span>
                    <span>• {selectedHallForDetails.timings.evening}</span>
                  </div>
                  <p className="text-xs text-[#F8E7C8]/85 italic mt-1.5">
                    {selectedHallForDetails.timings.note}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setSelectedHallForDetails(null)}
                  className="px-5 py-2.5 rounded-md border border-[#741B1B] text-[#741B1B] font-bold text-xs tracking-widest uppercase hover:bg-[#F8E7C8] cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleOpenBooking(selectedHallForDetails.id)}
                  className="px-6 py-2.5 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] font-bold text-xs tracking-widest uppercase shadow-md cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BOOK THIS HALL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL B: BOOKING ENQUIRY FORM (With Session Selection, Date Check & Pending Status)
         ===================================================================== */}
      {bookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#FFF0D5] border-2 border-[#C99A43] rounded-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#741B1B] text-[#FFF0D5] px-6 py-5 border-b-2 border-[#C99A43] flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#C99A43] uppercase font-semibold">
                  Buntara Bhavana – Guruvayankere
                </p>
                <h3
                  className="text-lg sm:text-xl font-bold tracking-wide mt-0.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  HALL BOOKING ENQUIRY
                </h3>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43]/60 hover:border-[#C99A43] cursor-pointer"
                aria-label="Close Booking Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Body */}
            <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
              {bookingSuccessData ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#741B1B] text-[#C99A43] border-2 border-[#C99A43] flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4
                    className="text-xl sm:text-2xl font-bold text-[#741B1B]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Booking Request Submitted
                  </h4>
                  <p className="mt-2 text-sm sm:text-base text-[#48251B] max-w-md mx-auto">
                    Thank you, <strong>{bookingSuccessData.customerName}</strong>. Your
                    enquiry has been recorded and remains{' '}
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#741B1B] text-[#FFF0D5] text-xs font-bold uppercase tracking-wider">
                      Pending Administrator Approval
                    </span>
                    .
                  </p>
                  {!currentUser && (
                    <p className="mt-2 text-sm text-[#6B5144]">
                      Save your reference ID for follow-up. Guest bookings are not linked to a profile or shown in booking history.
                    </p>
                  )}

                  <div className="mt-6 bg-[#F8E7C8] border border-[#C99A43] rounded-lg p-5 text-left text-sm space-y-2">
                    <div className="flex justify-between border-b border-[#C99A43]/40 pb-2">
                      <span className="text-[#A64B2A] font-semibold">Reference ID:</span>
                      <span className="font-bold text-[#741B1B]">{bookingSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A64B2A] font-semibold">Selected Hall:</span>
                      <span className="font-bold text-right">{bookingSuccessData.hallName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A64B2A] font-semibold">Hall Rental Price:</span>
                      <span className="font-bold text-[#741B1B]">
                        {bookingSuccessData.rentalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A64B2A] font-semibold">Booking Date:</span>
                      <span className="font-bold">{bookingSuccessData.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A64B2A] font-semibold">Selected Session:</span>
                      <span className="font-bold">{bookingSuccessData.session}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A64B2A] font-semibold">Booking Status:</span>
                      <span className="font-bold text-[#A64B2A]">
                        Pending (Confirmation after Admin Approval)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="mt-6 px-7 py-3 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] font-bold text-xs tracking-widest uppercase cursor-pointer"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Return to Website
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <p className="rounded-lg border border-[#C99A43]/60 bg-[#F8E7C8] px-3 py-2 text-sm text-[#6B3A2B]">
                    You can submit this enquiry as a guest—no registration or sign-in required.
                  </p>
                  {bookingError && (
                    <div className="p-3.5 rounded-lg bg-[#741B1B]/10 border border-[#741B1B] text-[#741B1B] text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={bookingForm.customerName}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customerName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXXXXXXX"
                        value={bookingForm.mobileNumber}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, mobileNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={bookingForm.emailAddress}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, emailAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Type of Function / Event *
                      </label>
                      <select
                        value={bookingForm.eventType}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, eventType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      >
                        <option value="Wedding">Wedding Ceremony</option>
                        <option value="Reception">Wedding Reception</option>
                        <option value="Engagement">Engagement Ceremony</option>
                        <option value="Naming Ceremony">Naming Ceremony</option>
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Cultural Program / Yakshagana">
                          Cultural Program / Yakshagana
                        </option>
                        <option value="Family Gathering / Meeting">
                          Family Gathering / Meeting
                        </option>
                        <option value="Other Traditional Occasion">
                          Other Traditional Occasion
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Select Hall & Auto-Populated Hall Rental Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8E7C8] p-3.5 rounded-lg border border-[#C99A43]">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                        Select Hall *
                      </label>
                      <select
                        value={bookingForm.hallId}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, hallId: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-md bg-[#FFF0D5] border border-[#C99A43] text-[#48251B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      >
                        {hallsData.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                        Hall Rental Price
                      </label>
                      <div
                        className="w-full px-3.5 py-2 rounded-md bg-[#741B1B] text-[#FFF0D5] border border-[#C99A43] font-bold text-lg text-center"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {selectedHallObj.formattedPrice}
                      </div>
                    </div>
                  </div>

                  {/* Date, Session Selection & Live Availability Indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Booking Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.eventDate}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, eventDate: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Session Selection *
                      </label>
                      <select
                        value={bookingForm.session}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, session: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      >
                        <option value="Morning Session">
                          {selectedHallObj.id === 'arvaguthu-mini'
                            ? 'Morning Session (8:00 AM – 3:00 PM)'
                            : selectedHallObj.id === 'malady-tunga'
                            ? 'Morning Session (10:00 AM – 2:30 PM)'
                            : 'Morning Session'}
                        </option>
                        <option value="Evening Session">
                          {selectedHallObj.id === 'arvaguthu-mini'
                            ? 'Evening Session (6:00 PM – 10:30 PM)'
                            : selectedHallObj.id === 'malady-tunga'
                            ? 'Evening Session (6:00 PM – 10:00 PM)'
                            : 'Evening Session'}
                        </option>
                        <option value="Full-Day Session">Full-Day Session</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Date Availability Check Feedback */}
                  {selectedSlotStatus && (
                    <div
                      className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 border ${
                        selectedSlotStatus === 'available'
                          ? 'bg-emerald-950/10 border-emerald-800/40 text-emerald-900'
                          : 'bg-[#741B1B]/10 border-[#741B1B] text-[#741B1B]'
                      }`}
                    >
                      {selectedSlotStatus === 'available' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>
                            Date Available: {selectedHallObj.name} is open for enquiry on{' '}
                            {bookingForm.eventDate} ({bookingForm.session}).
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-[#741B1B] shrink-0" />
                          <span>
                            Already Approved: This hall is already booked on{' '}
                            {bookingForm.eventDate} ({bookingForm.session}).
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Approximate guest count"
                        value={bookingForm.numberOfGuests}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, numberOfGuests: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div className="flex items-end">
                      <p className="text-xs text-[#A64B2A] italic pb-2">
                        Timings and availability are finalized upon management confirmation.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#48251B] mb-1">
                      Additional Requirements / Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share any specific ceremony timings, dining hall needs, or questions..."
                      value={bookingForm.additionalMessage}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, additionalMessage: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-md bg-[#F8E7C8] border border-[#C99A43] text-[#48251B] focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[#A64B2A] italic">
                      * Booking remains Pending until approved by Buntara Bhavana administration.
                    </p>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] font-bold text-xs tracking-[0.12em] uppercase shadow-md cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      SUBMIT ENQUIRY
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL C: NAVIGATION VIEWS (ABOUT, FACILITIES, GALLERY, EVENTS, CONTACT)
         ===================================================================== */}
      {activeInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl bg-[#FFF0D5] border-2 border-[#C99A43] rounded-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#741B1B] text-[#FFF0D5] px-6 py-4 border-b-2 border-[#C99A43] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#C99A43]">✦</span>
                <h3
                  className="text-lg sm:text-xl font-bold tracking-[0.1em] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {activeInfoModal === 'about' && 'ABOUT BUNTARA BHAVANA'}
                  {activeInfoModal === 'facilities' && 'VENUE FACILITIES'}
                  {activeInfoModal === 'gallery' && 'VENUE PHOTO GALLERY'}
                  {activeInfoModal === 'events' && 'CELEBRATIONS & EVENTS'}
                  {activeInfoModal === 'contact' && 'CONTACT & LOCATION'}
                </h3>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43]/60 hover:border-[#C99A43] cursor-pointer"
                aria-label="Close Dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto">
              {/* ABOUT VIEW */}
              {activeInfoModal === 'about' && (
                <div className="space-y-4 text-[#48251B] leading-relaxed">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-[#741B1B]" />
                    <h4
                      className="text-xl font-bold text-[#741B1B]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {siteContent.aboutTitle}
                    </h4>
                  </div>
                  <p>{siteContent.aboutIntro}</p>
                  <p>{siteContent.aboutDetails}</p>
                </div>
              )}

              {/* FACILITIES VIEW (Strictly the 6 Confirmed Facilities Only) */}
              {activeInfoModal === 'facilities' && (
                <div>
                  <p className="text-sm sm:text-base text-[#48251B] mb-6">
                    {siteContent.facilitiesIntro}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facilitiesData.map(({ id, title, subtitle, description, icon: Icon }) => (
                      <div
                        key={id}
                        className="p-4 rounded-lg bg-[#F8E7C8] border border-[#C99A43] flex items-start gap-3.5"
                      >
                        <div className="w-11 h-11 rounded-full bg-[#741B1B] text-[#C99A43] border border-[#C99A43] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4
                            className="text-sm font-bold text-[#741B1B]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {title}
                          </h4>
                          <p className="text-xs font-semibold text-[#A64B2A] mt-0.5">
                            {subtitle}
                          </p>
                          <p className="text-xs sm:text-sm text-[#48251B]/90 mt-1.5 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GALLERY VIEW */}
              {activeInfoModal === 'gallery' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[#741B1B]">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">
                        Explore our venue spaces at Guruvayankere
                      </span>
                    </div>
                    <span className="text-xs text-[#A64B2A]">
                      Admin-managed venue photos are shown here.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        key: 'hero',
                        label: '1. Buntara Bhavana – Guruvayankere Exterior (main pic.jpg)',
                        img: HERO_SLIDES[0].image,
                        fallbacks: HERO_SLIDES[0].fallbackImages,
                        variant: 'exterior'
                      },
                      ...hallsData.map((h, i) => ({
                        key: h.id,
                        label: `${i + 2}. ${h.name} (${h.category})`,
                        img: h.image,
                        fallbacks: h.fallbackImages,
                        variant: 'hall'
                      })),
                      ...galleryItems.map((item, i) => ({
                        key: item.id,
                        label: `${i + 1}. ${item.title}`,
                        img: item.image_url,
                        fallbacks: [],
                        variant: 'hall'
                      }))
                    ].map((photo) => (
                      <div
                        key={photo.label}
                        className="rounded-lg overflow-hidden border-2 border-[#C99A43] bg-[#F8E7C8] flex flex-col justify-between"
                      >
                        <VenueImage
                          src={photo.img}
                          fallbacks={photo.fallbacks}
                          customSrc={customPhotos[photo.key]}
                          variant={photo.variant}
                          alt={photo.label}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3 flex items-center justify-between gap-2">
                          <p
                            className="text-xs font-bold text-[#741B1B] tracking-wide"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {photo.label}
                          </p>
                          <label className="shrink-0 px-2.5 py-1 rounded bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-[#C99A43] text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                            Load Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handlePhotoUpload(photo.key, e.target.files?.[0])
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVENTS VIEW */}
              {activeInfoModal === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#741B1B]">
                    <CalendarDays className="w-5 h-5" />
                    <h4
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {siteContent.eventsTitle}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {(siteContent.events || []).map((ev) => (
                      <div
                        key={ev.title}
                        className="p-4 rounded-lg bg-[#F8E7C8] border border-[#C99A43]"
                      >
                        <h5
                          className="font-bold text-[#741B1B]"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {ev.title}
                        </h5>
                        <p className="mt-1.5 text-[#48251B]/90">{ev.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT VIEW */}
              {activeInfoModal === 'contact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#48251B]">
                  <div className="bg-[#F8E7C8] p-5 rounded-lg border border-[#C99A43] space-y-3">
                    <h4
                      className="text-base font-bold text-[#741B1B]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Venue Office Address
                    </h4>
                    <p className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-[#741B1B] shrink-0 mt-0.5" />
                      <span>
                        <strong>Buntara Bhavana</strong>
                        <br />
                        {siteContent.contactAddress}
                      </span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#741B1B]" />
                      <span>{siteContent.contactPhone}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#741B1B]" />
                      <span>{siteContent.contactEmail}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#741B1B]" />
                      <span>Office Hours: {siteContent.officeHours}</span>
                    </p>
                  </div>

                  <div className="bg-[#741B1B] text-[#FFF0D5] p-5 rounded-lg border-2 border-[#C99A43] flex flex-col justify-between">
                    <div>
                      <h4
                        className="text-base font-bold text-[#C99A43]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Plan Your Celebration
                      </h4>
                      <p className="mt-2 text-[#FFF0D5]/90 leading-relaxed">
                        Check hall availability or submit a booking enquiry online for Malady
                        Tunga and Mundappa Shetty Vedike, Kaashi Shetty Vedike, or Arvaguthu K.
                        Narayana Rai Vedike.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenBooking('malady-tunga')}
                      className="mt-5 w-full py-3 rounded-md bg-[#C99A43] hover:bg-[#d8aa52] text-[#48251B] font-bold text-xs tracking-widest uppercase cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      OPEN BOOKING ENQUIRY
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}