// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Maximize2,
  ExternalLink
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
    hallNumber: 1,
    hallTag: 'Hall 1',
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
    hallNumber: 2,
    hallTag: 'Hall 2',
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
    hallNumber: 3,
    hallTag: 'Hall 3',
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

// Default Verified Supabase Storage Photographs for Hero Slideshow
const DEFAULT_HERO_SLIDES = [
  {
    id: 0,
    title: 'Buntara Bhavana Front Exterior View',
    image: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-1-c21f8b6e-007e-47c4-b860-801dcbf7187e-WhatsApp_Image_2026-11-12_at_3.23.30_PM__1__-_Copy_-_Copy.jpeg',
    fallbackImages: ['/main pic.jpg', './main%20pic.jpg'],
    variant: 'exterior'
  },
  {
    id: 1,
    title: 'Malady Tunga Vedike Grand AC Banquet Hall',
    image: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-2-eeeeca3e-4660-4382-a5fb-f61e01a97357-WhatsApp_Image_2026-11-12_at_3.23.59_PM.jpeg',
    fallbackImages: ['/malady.jpg', './malady.jpg'],
    variant: 'malady-tunga'
  },
  {
    id: 2,
    title: 'Kaashi Shetty Vedike & Cultural Banquet Dining',
    image: 'https://mmmaheyictnnmjnbvtrj.supabase.co/storage/v1/object/public/venue-gallery/hero/slide-3-9f8928df-30e9-461b-96bb-1c33a09b3c8b-WhatsApp_Image_2026-11-12_at_3.24.31_PM.jpeg',
    fallbackImages: ['/kaashi hall.jpg', './kaashi%20hall.jpg'],
    variant: 'kaashi-shetty'
  }
];

const HERO_SLIDES = DEFAULT_HERO_SLIDES;

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

// High-Contrast Traditional Indian Brass Oil Lamp (Nilavilakku / Deepa) with Warm Glowing Flame
const TraditionalDeepaLamp = ({ className = 'w-16 h-60', flip = false }) => (
  <svg
    viewBox="0 0 100 260"
    className={`${className} ${flip ? 'scale-x-[-1]' : ''}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      {/* Radiant Brass Gradients for High Visual Contrast */}
      <linearGradient id="deepaBrassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8C5310" />
        <stop offset="20%" stopColor="#E2A638" />
        <stop offset="45%" stopColor="#FFF2A3" />
        <stop offset="70%" stopColor="#D49A2B" />
        <stop offset="100%" stopColor="#6E3D06" />
      </linearGradient>
      <linearGradient id="deepaBrassDark" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4D2A04" />
        <stop offset="50%" stopColor="#9C6B1B" />
        <stop offset="100%" stopColor="#3B1E02" />
      </linearGradient>

      {/* Warm Golden Flame Halos */}
      <radialGradient id="deepaFlameHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFEE8" stopOpacity="1" />
        <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.85" />
        <stop offset="70%" stopColor="#F97316" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="deepaWideGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
        <stop offset="55%" stopColor="#D97706" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient Wide Glow behind flame */}
    <circle cx="50" cy="32" r="30" fill="url(#deepaWideGlow)" />
    {/* Inner Vivid Flame Halo */}
    <circle cx="50" cy="32" r="22" fill="url(#deepaFlameHalo)" />

    {/* Sacred Flame Teardrop Layers */}
    <path
      d="M50 12C50 12 59 24 59 33C59 38 55 42 50 42C45 42 41 38 41 33C41 24 50 12 50 12Z"
      fill="#FDE047"
    />
    <path
      d="M50 17C50 17 56 25 56 32C56 36 53.5 39 50 39C46.5 39 44 36 44 32C44 25 50 17 50 17Z"
      fill="#FFFBEB"
    />
    <path
      d="M50 22C50 22 53.5 27 53.5 31.5C53.5 34 52 36 50 36C48 36 46.5 34 46.5 31.5C46.5 27 50 22 50 22Z"
      fill="#FFFFFF"
    />

    {/* Top Prabha / Crown Finial */}
    <path d="M50 38L54 48H46L50 38Z" fill="url(#deepaBrassGrad)" />
    <circle cx="50" cy="51" r="4.5" fill="url(#deepaBrassGrad)" />

    {/* Traditional Oil Reservoir Bowl (Thoni / Agal) */}
    <path
      d="M20 57C26 68 74 68 80 57C72 61 28 61 20 57Z"
      fill="url(#deepaBrassGrad)"
    />
    <ellipse cx="50" cy="57" rx="28" ry="4.5" fill="#6E3D06" />
    <ellipse cx="50" cy="56" rx="26" ry="3.5" fill="url(#deepaBrassGrad)" />
    {/* Decorative Beads under Bowl */}
    <circle cx="35" cy="63" r="2.5" fill="url(#deepaBrassGrad)" />
    <circle cx="50" cy="64" r="3" fill="url(#deepaBrassGrad)" />
    <circle cx="65" cy="63" r="2.5" fill="url(#deepaBrassGrad)" />

    {/* Central Pillar Stem with Multiple Traditional Kalasha Rings */}
    <ellipse cx="50" cy="72" rx="12" ry="4" fill="url(#deepaBrassGrad)" />
    <rect x="46" y="74" width="8" height="28" fill="url(#deepaBrassGrad)" />
    {/* Kalasha Bulb 1 */}
    <ellipse cx="50" cy="104" rx="14" ry="7" fill="url(#deepaBrassGrad)" />
    <ellipse cx="50" cy="111" rx="11" ry="3" fill="url(#deepaBrassDark)" />

    {/* Middle Stem */}
    <rect x="46.5" y="113" width="7" height="34" fill="url(#deepaBrassGrad)" />
    {/* Kalasha Bulb 2 */}
    <ellipse cx="50" cy="149" rx="15" ry="7.5" fill="url(#deepaBrassGrad)" />
    <ellipse cx="50" cy="157" rx="12" ry="3.5" fill="url(#deepaBrassDark)" />

    {/* Lower Stem */}
    <rect x="46" y="159" width="8" height="36" fill="url(#deepaBrassGrad)" />
    <ellipse cx="50" cy="197" rx="16" ry="4" fill="url(#deepaBrassGrad)" />

    {/* Tiered Pedestal Base */}
    <path d="M32 201H68L74 216H26L32 201Z" fill="url(#deepaBrassGrad)" />
    <path d="M22 216H78L84 234H16L22 216Z" fill="url(#deepaBrassDark)" />
    <path d="M14 234H86L90 248H10L14 234Z" fill="url(#deepaBrassGrad)" />
    <rect x="6" y="248" width="88" height="8" rx="3" fill="#4D2A04" />
    <rect x="10" y="249" width="80" height="3" rx="1.5" fill="url(#deepaBrassGrad)" />
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
  const [entryPopUpOpen, setEntryPopUpOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
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
    contactEmail: 'buntarabhavanagkere@gmail.com',
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
        const hallNumber = hall.id === 'malady-tunga' ? 1 : hall.id === 'kaashi-shetty' ? 2 : 3;
        const hallTag = `Hall ${hallNumber}`;

        // Live database highlights from direct column or details JSONB
        const dbHighlights = Array.isArray(hall.highlights) && hall.highlights.length > 0
          ? hall.highlights
          : (Array.isArray(hall.details?.highlights) && hall.details.highlights.length > 0
              ? hall.details.highlights
              : null);

        // Live database suitable events from direct column or details JSONB
        const dbSuitableEvents = Array.isArray(hall.suitable_events) && hall.suitable_events.length > 0
          ? hall.suitable_events
          : (Array.isArray(hall.suitableEvents) && hall.suitableEvents.length > 0
              ? hall.suitableEvents
              : (Array.isArray(hall.details?.suitableEvents) && hall.details.suitableEvents.length > 0
                  ? hall.details.suitableEvents
                  : (Array.isArray(hall.details?.suitable_events) && hall.details.suitable_events.length > 0
                      ? hall.details.suitable_events
                      : null)));

        return {
          ...fallback,
          ...hall,
          hallNumber,
          hallTag,
          formattedPrice: `₹${Number(hall.price).toLocaleString('en-IN')}`,
          image: hall.image_url || fallback.image,
          timings: hall.details?.timings || fallback.timings,
          highlights: dbHighlights !== null ? dbHighlights : (fallback.highlights || []),
          suitableEvents: dbSuitableEvents !== null ? dbSuitableEvents : (fallback.suitableEvents || []),
          structuredFacilities: hall.details?.structuredFacilities || fallback.structuredFacilities || []
        };
      }).sort((a, b) => a.hallNumber - b.hallNumber);

      setHallsData(mappedHalls);
      setSelectedHallForDetails((current: any) => {
        if (!current) return null;
        const fresh = mappedHalls.find((h) => h.id === current.id);
        return fresh || current;
      });
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
        session: booking.session,
        status: booking.status || 'approved'
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

    // Auto-refresh when tab is focused or returns from background
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        void loadSiteData();
      }
    };
    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // Live realtime subscription to venue_halls changes
    const hallsSubscription = supabase
      ? supabase
          .channel('public:venue_halls')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'venue_halls' },
            () => {
              void loadSiteData();
            }
          )
          .subscribe()
      : null;

    return () => {
      active = false;
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      if (hallsSubscription && supabase) {
        supabase.removeChannel(hallsSubscription);
      }
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
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Ref and date picker helper for 100% reliable click-to-open calendar popup
  const bookingDateInputRef = useRef(null);
  const todayDateString = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const handleOpenDatePicker = () => {
    if (bookingDateInputRef.current) {
      try {
        if (typeof bookingDateInputRef.current.showPicker === 'function') {
          bookingDateInputRef.current.showPicker();
        } else {
          bookingDateInputRef.current.focus();
        }
      } catch {
        bookingDateInputRef.current.focus();
      }
    }
  };

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

  // Automatic 4.5-second sequential hero background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Display welcoming Book Now pop-up modal when visitor first enters the site
  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setEntryPopUpOpen(true);
    }, 600);
    return () => clearTimeout(popupTimer);
  }, []);

  const selectedHallObj =
    hallsData.find((h) => h.id === bookingForm.hallId) || hallsData[0] || HALLS_DATA[0];

  useEffect(() => {
    if (!currentUser) return;
    setBookingForm((prev) => ({
      ...prev,
      customerName: prev.customerName || currentUser.fullName || '',
      mobileNumber: prev.mobileNumber || currentUser.phone || '',
      emailAddress: ''
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

    // Conflict check before insert: checks BOTH hall_id AND event_date together where status in ['pending', 'approved']
    const isAlreadyBooked = approvedBookings.some((b) => {
      const matchHall = b.hallId === bookingForm.hallId;
      const matchDate = b.date === bookingForm.eventDate;
      const matchStatus = b.status
        ? ['pending', 'approved'].includes(b.status.toLowerCase())
        : true;
      return matchHall && matchDate && matchStatus;
    });

    if (isAlreadyBooked) {
      const errMsg = 'This hall is already booked on the selected date.';
      setBookingError(errMsg);
      setToast({ type: 'error', message: errMsg });
      return;
    }

    const referenceCode = `BB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    // Explicit null profile_id for unauthenticated guest visitors
    const { error } = await supabase
      .from('booking_enquiries')
      .insert({
        reference_code: referenceCode,
        profile_id: null,
        customer_name: customerName,
        mobile_number: mobileNumber,
        email_address: emailAddress,
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
      const errorMsg = error.code === '42501'
        ? 'Guest booking is not enabled in the database yet. Please run the updated Supabase SQL migration.'
        : error.message;
      setBookingError(errorMsg);
      // Display Supabase .insert() error directly in a toast
      setToast({ type: 'error', message: `Booking submission error: ${errorMsg}` });
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
    // Immediately track this booked slot in live state so availability updates instantly
    setApprovedBookings((prev) => [
      ...prev,
      {
        hallId: bookingForm.hallId,
        date: bookingForm.eventDate,
        session: bookingForm.session
      }
    ]);
    setBookingSuccessData(newEnquiry);
  };

  // Real-time availability check for specific hall + event date (where status in ['pending', 'approved'])
  const selectedSlotStatus = (() => {
    if (!bookingForm.eventDate || !bookingForm.hallId) return null;
    const conflict = approvedBookings.some((b) => {
      const matchHall = b.hallId === bookingForm.hallId;
      const matchDate = b.date === bookingForm.eventDate;
      const matchStatus = b.status
        ? ['pending', 'approved'].includes(b.status.toLowerCase())
        : true;
      return matchHall && matchDate && matchStatus;
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



  return (
    <div
      className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-[#741B1B] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Lora', Georgia, serif" }}
    >
      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-5 right-5 z-[99999] max-w-md flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm backdrop-blur-md transition-all ${
            toast.type === 'error'
              ? 'bg-red-950/95 text-red-100 border-red-500/50 shadow-red-950/40'
              : 'bg-emerald-950/95 text-emerald-100 border-emerald-500/50 shadow-emerald-950/40'
          }`}
        >
          <span className="text-xl shrink-0">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{toast.type === 'error' ? 'Booking Error' : 'Success'}</p>
            <p className="text-xs mt-0.5 opacity-90 break-words leading-relaxed">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white p-1 rounded-md cursor-pointer shrink-0"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}
      {siteError && (
        <div role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-800">
          Could not load shared venue data: {siteError}
        </div>
      )}
      {/* =====================================================================
          1. TOP INFORMATION BAR (Dark Maroon #5A1015)
         ===================================================================== */}
      <div className="bg-[#5A1015] text-[#FFF0D5] border-b border-gray-200/35 text-xs sm:text-[13px] tracking-wide">
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
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
                  className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-gray-600 uppercase mt-0.5"
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
                    className="px-2.5 py-1.5 text-[12.5px] font-semibold tracking-[0.08em] text-gray-700 hover:text-[#741B1B] transition-colors relative group"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {link}
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#C99A43] scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="text-gray-300 text-xs select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Right Side: BOOK NOW Button + Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenBooking('malady-tunga')}
                className="inline-flex items-center gap-2 bg-[#741B1B] hover:bg-[#5A1015] text-white px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold tracking-[0.1em] shadow-sm hover:shadow-md transition-all cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Calendar className="w-4 h-4 text-[#C99A43]" />
                <span>BOOK NOW</span>
              </button>

              {/* Mobile / Tablet Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-lg border border-gray-200/60 text-[#741B1B] hover:bg-gray-50 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-5 shadow-md">
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
                  className="text-left px-3 py-2.5 rounded-md text-xs font-bold tracking-[0.08em] text-[#741B1B] hover:bg-[#FFF0D5] border border-transparent hover:border-gray-200/50 transition-all"
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
          3. HERO BANNER – SEQUENTIAL SLIDESHOW & HIGH-CONTRAST BRASS LAMPS
         ===================================================================== */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center overflow-hidden border-b-2 border-[#C99A43] bg-[#0B192C]">
        
        {/* 3-Photo Sequential Background Slideshow with Smooth CSS Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[
            (siteContent.heroImages && siteContent.heroImages[0]) || siteContent.heroImage || DEFAULT_HERO_SLIDES[0].image,
            (siteContent.heroImages && siteContent.heroImages[1]) || DEFAULT_HERO_SLIDES[1].image,
            (siteContent.heroImages && siteContent.heroImages[2]) || DEFAULT_HERO_SLIDES[2].image
          ].map((imageUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activeHeroSlide === idx ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none -z-10'
              }`}
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: '1000ms'
              }}
            >
              <img
                src={imageUrl}
                alt={`Buntara Bhavana Guruvayankere Hero View ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Dark Navy Gradient Overlay: Sits strictly between background photos (z-0) and foreground text/lamps (z-20) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(11, 25, 44, 0.70) 0%, rgba(11, 25, 44, 0.52) 45%, rgba(11, 25, 44, 0.85) 100%)'
          }}
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(11, 25, 44, 0.15) 0%, rgba(11, 25, 44, 0.72) 100%)'
          }}
        />

        {/* Natural Greenery & Marigold Floral Corner Framing */}
        <div className="z-15 pointer-events-none">
          <FloralCornerAccent position="top-left" />
          <FloralCornerAccent position="top-right" />
          <FloralCornerAccent position="bottom-left" />
          <FloralCornerAccent position="bottom-right" />
        </div>

        {/* Subtle Gold Inner Frame Border */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-[#C99A43]/35 rounded-sm z-15" />

        {/* Hero Symmetrical Content Container (relative z-20 above overlay) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 md:gap-8 max-w-6xl mx-auto">
            
            {/* Left Visible High-Contrast Traditional Brass Lamp (Deepam) */}
            <div className="flex flex-col items-center shrink-0 select-none">
              <TraditionalDeepaLamp
                className="w-10 sm:w-16 md:w-20 lg:w-24 h-36 sm:h-52 md:h-64 lg:h-76 drop-shadow-[0_0_24px_rgba(251,191,36,0.85)] transition-transform duration-300 hover:scale-105"
              />
              <span
                className="text-[9px] sm:text-[11px] md:text-xs font-bold text-[#F3CF7A] tracking-[0.25em] mt-1 sm:mt-2 uppercase text-center drop-shadow"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Deepam
              </span>
            </div>

            {/* Central Typography & Action Buttons */}
            <div className="flex-1 text-center max-w-2xl px-1 sm:px-4">
              {/* Top Kicker with Gold Lines */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="h-[1.5px] w-6 sm:w-10 bg-[#C99A43]" />
                <p
                  className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.24em] text-[#F3CF7A] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {siteContent.heroKicker || 'TRADITION • CULTURE • CELEBRATION'}
                </p>
                <span className="h-[1.5px] w-6 sm:w-10 bg-[#C99A43]" />
              </div>

              {/* Main Heading */}
              <h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[0.04em] leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                BUNTARA BHAVANA
              </h1>

              {/* Gold Location Tag */}
              <div className="mt-1.5 sm:mt-2.5 flex items-center justify-center">
                <p
                  className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-[#C99A43] tracking-[0.28em] sm:tracking-[0.34em] uppercase drop-shadow"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  GURUVAYANKERE
                </p>
              </div>

              {/* Ornamental Golden Divider */}
              <div className="w-36 sm:w-56 md:w-72 h-[1.5px] bg-gradient-to-r from-transparent via-[#F3CF7A] to-transparent my-3 sm:my-4 mx-auto" />

              {/* Tagline */}
              <p
                className="text-sm sm:text-lg md:text-xl text-[#FFF9EE] italic font-medium leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] max-w-xl mx-auto"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                &ldquo;{siteContent.heroTagline || 'A Beautiful Place for Celebrations, Gatherings & Memories.'}&rdquo;
              </p>

              {/* Dual Attractive CTA Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleNavClick('OUR HALLS')}
                  className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg bg-[#C99A43] hover:bg-[#d8aa52] text-gray-900 font-bold text-xs sm:text-sm tracking-[0.12em] uppercase shadow-xl border border-[#FFF0D5]/50 transition-all transform hover:scale-[1.02] cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  EXPLORE OUR HALLS
                </button>

                <button
                  onClick={() => handleOpenBooking('malady-tunga')}
                  className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg bg-[#741B1B]/95 hover:bg-[#5A1015] text-[#FFF9EE] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase shadow-xl border-2 border-[#C99A43] transition-all transform hover:scale-[1.02] cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BOOK YOUR CELEBRATION
                </button>
              </div>
            </div>

            {/* Right Visible High-Contrast Traditional Brass Lamp (Mangalam) */}
            <div className="flex flex-col items-center shrink-0 select-none">
              <TraditionalDeepaLamp
                flip
                className="w-10 sm:w-16 md:w-20 lg:w-24 h-36 sm:h-52 md:h-64 lg:h-76 drop-shadow-[0_0_24px_rgba(251,191,36,0.85)] transition-transform duration-300 hover:scale-105"
              />
              <span
                className="text-[9px] sm:text-[11px] md:text-xs font-bold text-[#F3CF7A] tracking-[0.25em] mt-1 sm:mt-2 uppercase text-center drop-shadow"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Mangalam
              </span>
            </div>

          </div>
        </div>

        {/* Sequential Slide Indicators at Bottom Centre */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#0B192C]/85 px-4 py-2 rounded-full border border-[#C99A43]/50 backdrop-blur-sm shadow-xl"
          role="tablist"
          aria-label="Hero Slideshow Indicators"
        >
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveHeroSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeHeroSlide === idx
                  ? 'w-7 h-2.5 bg-[#C99A43] shadow-[0_0_8px_#C99A43]'
                  : 'w-2.5 h-2.5 bg-[#FFF9EE]/50 hover:bg-[#FFF9EE]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. THREE DISTINCTIVE SPACES – MOST IMPORTANT CONTENT SECTION
         ===================================================================== */}
      <main id="our-halls-section" className="relative py-16 sm:py-20 bg-gray-50/70 border-b border-gray-200">
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
              className="mt-2.5 text-lg sm:text-2xl italic text-gray-600 font-medium"
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
                className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Large Actual Hall Photograph at the Top */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden border-b border-gray-200">
                  <VenueImage
                    src={hall.image}
                    fallbacks={hall.fallbackImages}
                    variant="hall"
                    alt={hall.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#48251B]/55 via-transparent to-transparent pointer-events-none" />

                  {/* Hall Number Badge */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#0B192C]/90 text-[#F3CF7A] border border-[#C99A43] text-[11px] font-bold tracking-[0.14em] uppercase shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                    <span>🏛️</span>
                    <span>{hall.hallTag || (hall.id === 'malady-tunga' ? 'Hall 1' : hall.id === 'kaashi-shetty' ? 'Hall 2' : 'Hall 3')}</span>
                  </span>

                  {/* Category Badge */}
                  <span
                    className="absolute top-3.5 right-3.5 px-3.5 py-1 rounded-full bg-[#741B1B] text-[#FFF0D5] border border-gray-200 text-[11px] font-bold tracking-[0.14em] uppercase shadow-md"
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
                      className="text-lg sm:text-[19px] font-bold text-gray-900 tracking-[0.03em] leading-snug min-h-[52px]"
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
                      <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
                        / Per Day Rental
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                      {hall.description}
                    </p>

                    {/* Hall Highlights Badges/Bullets */}
                    {hall.highlights && hall.highlights.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-gray-100">
                        <p
                          className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#741B1B] mb-2 flex items-center justify-between"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>✦</span>
                            <span>Key Highlights</span>
                          </span>
                          <span className="text-[10px] text-gray-500 font-normal lowercase tracking-normal">
                            {hall.highlights.length} features
                          </span>
                        </p>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          {hall.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-[#C99A43] font-bold shrink-0 mt-0.5">✦</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Two Action Buttons: EXPLORE HALL & BOOK THIS HALL */}
                  <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedHallForDetails(hall)}
                      className="py-2.5 px-3 rounded-lg bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400 font-bold text-[11.5px] tracking-[0.08em] uppercase transition-colors cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      EXPLORE HALL
                    </button>

                    <button
                      onClick={() => handleOpenBooking(hall.id)}
                      className="py-2.5 px-3 rounded-lg bg-[#741B1B] hover:bg-[#5A1015] text-white font-bold text-[11.5px] tracking-[0.08em] uppercase shadow-sm hover:shadow-md transition-colors cursor-pointer"
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
          HOME PAGE GALLERY SECTION (Synced with Admin Uploads - View-Only)
         ===================================================================== */}
      <section id="gallery-section" className="relative py-16 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-2">
              <GoldOrnamentalDivider />
              <span className="text-xs font-bold tracking-[0.22em] text-[#C99A43] uppercase">
                Visual Splendour
              </span>
              <GoldOrnamentalDivider flip />
            </div>
            <h2
              className="text-2xl sm:text-4xl font-bold text-[#0B192C] tracking-wide"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              VENUE PHOTO GALLERY
            </h2>
            <p
              className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Glimpse into the regal architecture, auspicious celebration spaces, and traditional Tulunadu hospitality at Buntara Bhavana.
            </p>
          </div>

          {/* View-Only Responsive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(galleryItems && galleryItems.length > 0
              ? galleryItems.map((item) => ({
                  id: item.id,
                  title: item.title || 'Buntara Bhavana Venue Gallery',
                  subtitle: 'Guruvayankere, Belthangady',
                  imageUrl: item.image_url,
                  fallbacks: []
                }))
              : [
                  {
                    id: 'gal-1',
                    title: 'Buntara Bhavana Exterior',
                    subtitle: 'Grand Traditional South Indian Facade & Portico',
                    imageUrl: (siteContent.heroImages && siteContent.heroImages[0]) || siteContent.heroImage || './main%20pic.jpg',
                    fallbacks: ['main pic.jpg', '/main pic.jpg']
                  },
                  {
                    id: 'gal-2',
                    title: 'Malady Tunga Vedike (AC Hall)',
                    subtitle: 'Royal Air-Conditioned Grand Celebration Space',
                    imageUrl: (siteContent.heroImages && siteContent.heroImages[1]) || './malady.jpg',
                    fallbacks: ['malady.jpg', '/malady.jpg']
                  },
                  {
                    id: 'gal-3',
                    title: 'Kaashi Shetty Vedike (Non-AC)',
                    subtitle: 'Spacious Naturally Ventilated Heritage Hall',
                    imageUrl: (siteContent.heroImages && siteContent.heroImages[2]) || './kaashi%20hall.jpg',
                    fallbacks: ['kaashi hall.jpg', '/kaashi hall.jpg']
                  },
                  {
                    id: 'gal-4',
                    title: 'Grand Banquet Dining Hall',
                    subtitle: 'Spacious Dedicated Dining with Pure Veg & Non-Veg Facilities',
                    imageUrl: './kaashi%20hall.jpg',
                    fallbacks: ['kaashi hall.jpg', '/kaashi hall.jpg']
                  },
                  {
                    id: 'gal-5',
                    title: 'Grand Stage & Auspicious Mandapam',
                    subtitle: 'Majestic Floral & Stage Setup for Auspicious Muhurthams',
                    imageUrl: './malady.jpg',
                    fallbacks: ['malady.jpg', '/malady.jpg']
                  },
                  {
                    id: 'gal-6',
                    title: 'Guest Reception & Welcoming Portico',
                    subtitle: 'Smooth Circular Driveway & Ample 50+ Car Parking',
                    imageUrl: (siteContent.heroImages && siteContent.heroImages[0]) || siteContent.heroImage || './main%20pic.jpg',
                    fallbacks: ['main pic.jpg', '/main pic.jpg']
                  }
                ]
            ).map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActiveLightboxImage({ title: photo.title, imageUrl: photo.imageUrl })}
                className="group relative h-64 sm:h-72 rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl hover:border-[#C99A43] transition-all duration-300 cursor-pointer bg-gray-100"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (photo.fallbacks && photo.fallbacks.length > 0) {
                      target.src = photo.fallbacks[0];
                    }
                  }}
                />
                {/* Gradient Overlay & Captions */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className="text-base sm:text-lg font-bold text-[#FFF9EE] leading-snug drop-shadow"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {photo.title}
                      </h4>
                      <p className="text-xs text-[#F3CF7A] mt-1 font-medium tracking-wide">
                        {photo.subtitle}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#C99A43]/80 group-hover:bg-[#C99A43] text-[#0B192C] flex items-center justify-center shrink-0 transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Prompt */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setActiveInfoModal('gallery')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#C99A43] text-[#0B192C] hover:bg-[#C99A43] hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span>View Full Venue Gallery</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          HALL POLICIES & GUIDELINES SECTION
         ===================================================================== */}
      <section id="hall-policies-section" className="relative py-16 sm:py-20 bg-[#0B192C] text-[#FFF9EE] border-b border-[#C99A43]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-2">
              <GoldOrnamentalDivider />
              <span className="text-xs font-bold tracking-[0.22em] text-[#C99A43] uppercase">
                Important Information
              </span>
              <GoldOrnamentalDivider flip />
            </div>
            <h2
              className="text-2xl sm:text-4xl font-bold text-[#FFF9EE] tracking-wide"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              HALL POLICIES &amp; GUIDELINES
            </h2>
            <p
              className="mt-3 text-base sm:text-lg text-gray-300 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Clear, transparent guidelines designed to ensure every wedding, auspicious muhurtham, and gathering runs smoothly.
            </p>
          </div>

          {/* 3-Column Structured Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Food Policy (Veg & Non-Veg) */}
            <div className="bg-[#112239] rounded-2xl border-2 border-[#C99A43]/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#C99A43] transition-all">
              <div>
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#C99A43]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#741B1B] text-[#C99A43] border border-[#C99A43]/50 flex items-center justify-center shrink-0 shadow-md">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FFF9EE]" style={{ fontFamily: "'Cinzel', serif" }}>
                      Food &amp; Catering Policy
                    </h3>
                    <p className="text-xs text-[#C99A43] font-medium tracking-wide">Dining Guidelines</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-200">
                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      Pure Vegetarian (Veg)
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      Dedicated Satvik pure-veg kitchen and plantain-leaf traditional dining hall available. Perfect for auspicious Vedic rituals, thread ceremonies, and traditional feasts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      Non-Vegetarian (Non-Veg)
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      Non-vegetarian catering and dining is permitted strictly in designated banquet dining areas. Outside professional caterers are welcome with advance authorization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C99A43]/20 flex items-center justify-between text-[11px] text-[#C99A43]">
                <span>Eco-friendly disposables encouraged</span>
                <span>❖ Strict Hygiene</span>
              </div>
            </div>

            {/* Card 2: Dedicated Parking Capacity */}
            <div className="bg-[#112239] rounded-2xl border-2 border-[#C99A43]/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#C99A43] transition-all">
              <div>
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#C99A43]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#741B1B] text-[#C99A43] border border-[#C99A43]/50 flex items-center justify-center shrink-0 shadow-md">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FFF9EE]" style={{ fontFamily: "'Cinzel', serif" }}>
                      Parking &amp; Access
                    </h3>
                    <p className="text-xs text-[#C99A43] font-medium tracking-wide">Vehicle Capacity</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-gray-200">
                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <p className="text-sm font-bold text-[#F3CF7A] mb-1">
                      Dedicated 50+ Vehicle Parking
                    </p>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      Ample, secure on-site parking capacity for up to <strong>50 cars and light vehicles</strong>, with separate designated parking space for two-wheelers and tourist coaches.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <p className="text-sm font-bold text-[#F3CF7A] mb-1">
                      Circular Porch &amp; VIP Drop-Off
                    </p>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      Wide circular portico driveway allows effortless, sheltered drop-off for wedding couples, elders, and VIP guests right at the main entryway.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <p className="text-sm font-bold text-[#F3CF7A] mb-1">
                      Elevator &amp; Ramp Accessibility
                    </p>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      Modern passenger lift facility connects dining and stage halls seamlessly for senior citizens and differently-abled guests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C99A43]/20 flex items-center justify-between text-[11px] text-[#C99A43]">
                <span>Senior citizen friendly</span>
                <span>❖ 24/7 Security</span>
              </div>
            </div>

            {/* Card 3: Timings & Available Booking Slots */}
            <div className="bg-[#112239] rounded-2xl border-2 border-[#C99A43]/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#C99A43] transition-all">
              <div>
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#C99A43]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#741B1B] text-[#C99A43] border border-[#C99A43]/50 flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FFF9EE]" style={{ fontFamily: "'Cinzel', serif" }}>
                      Timings &amp; Booking Slots
                    </h3>
                    <p className="text-xs text-[#C99A43] font-medium tracking-wide">Synchronized Session Times</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-gray-200">
                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F3CF7A] text-xs uppercase tracking-wide">Morning Session</span>
                      <span className="text-[11px] font-semibold text-[#FFF9EE] bg-[#741B1B] px-2 py-0.5 rounded">10:00 AM – 2:30 PM</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Early access from 8:00 AM for floral stage decoration, pooja preparation, and traditional muhurtham rituals.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F3CF7A] text-xs uppercase tracking-wide">Evening Session</span>
                      <span className="text-[11px] font-semibold text-[#FFF9EE] bg-[#741B1B] px-2 py-0.5 rounded">6:00 PM – 10:00 PM</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Ideal for grand wedding receptions, sangeet nights, felicitation ceremonies, and dinner banquets.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B192C]/80 border border-[#C99A43]/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F3CF7A] text-xs uppercase tracking-wide">Full Day Session</span>
                      <span className="text-[11px] font-semibold text-[#FFF9EE] bg-[#741B1B] px-2 py-0.5 rounded">8:00 AM – 10:30 PM</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Complete uninterrupted access to the main vedike, green rooms, and dining hall throughout the entire day.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C99A43]/20">
                <button
                  onClick={() => handleOpenBooking('malady-tunga')}
                  className="w-full py-2.5 rounded-lg bg-[#C99A43] hover:bg-[#d8aa52] text-[#0B192C] font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Check Available Dates &amp; Book
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          5. BOTTOM CULTURAL HIGHLIGHT STRIP & MAROON PROMOTIONAL BANNER
         ===================================================================== */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden">
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
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-2xs"
                >
                  <div className="w-11 h-11 rounded-full bg-[#741B1B] text-[#C99A43] border border-gray-200 flex items-center justify-center mb-2.5 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-xs sm:text-[13px] font-bold text-gray-800 leading-snug"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Side: Deep Maroon Promotional Banner with Gold Borders */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#741B1B] text-[#FFF0D5] p-6 sm:p-7 rounded-xl border-2 border-gray-200 shadow-lg text-center">
                <div className="pointer-events-none absolute inset-1.5 border border-gray-200/45 rounded-lg" />
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
          PROFESSIONAL RESPONSIVE WEBSITE FOOTER (Indian Banquet Heritage Style)
         ===================================================================== */}
      <footer className="relative bg-[#0B192C] text-[#FFF9EE] pt-16 pb-8 border-t-2 border-[#C99A43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#C99A43]/30">
            
            {/* Column 1: Hall Information (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col items-start space-y-4">
              {/* Logo & Hall Title */}
              <div className="flex items-center gap-3.5">
                <TempleLogoSVG className="w-12 h-12 shrink-0 drop-shadow-[0_0_12px_rgba(201,154,67,0.5)]" />
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold tracking-[0.08em] text-[#FFF9EE]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    BUNTARA BHAVANA
                  </h3>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[#C99A43] uppercase">
                    GURUVAYANKERE
                  </p>
                </div>
              </div>

              {/* Refined Description */}
              <p
                className="text-sm sm:text-base text-gray-300 leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                A prestigious heritage landmark offering traditional grandeur, modern air-conditioned amenities, and warm Tulunadu hospitality for weddings, receptions, and memorable family milestones.
              </p>

              {/* Highlighted Golden Call Now Button */}
              <div className="pt-2">
                <a
                  href={`tel:${siteContent.contactPhone || '+918256232456'}`}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#C99A43] hover:bg-[#d8aa52] text-[#0B192C] font-bold text-sm tracking-wider uppercase transition-all shadow-md group cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Call Now: {siteContent.contactPhone || '+91 8256 232 456'}</span>
                </a>
              </div>

              {/* Office Hours */}
              <div className="flex items-center gap-2.5 pt-1 text-xs text-gray-300">
                <span className="text-gray-400">Office Hours:</span>
                <span className="font-semibold text-[#FFF9EE] bg-[#112239] px-2.5 py-1 rounded border border-[#C99A43]/30">
                  {siteContent.officeHours || '9:30 AM – 6:00 PM'}
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links (lg:col-span-3) */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <h4
                  className="text-base sm:text-lg font-bold tracking-[0.14em] text-[#C99A43] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Quick Links
                </h4>
                <span className="h-0.5 w-8 bg-[#C99A43]" />
              </div>

              <nav className="flex flex-col space-y-2 text-sm sm:text-base">
                {[
                  { label: 'Home', action: () => handleNavClick('HOME') },
                  { label: 'About Us', action: () => handleNavClick('ABOUT') },
                  { label: 'Our Halls', action: () => handleNavClick('OUR HALLS') },
                  { label: 'Venue Gallery', action: () => handleNavClick('GALLERY') },
                  {
                    label: 'Hall Policies',
                    action: () => {
                      const el = document.getElementById('hall-policies-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  },
                  { label: 'Reviews & Events', action: () => handleNavClick('EVENTS') },
                  { label: 'Bookings', action: () => handleNavClick('BOOKING') },
                  { label: 'Contact Us', action: () => handleNavClick('CONTACT') }
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="group relative inline-flex items-center gap-2 text-left text-gray-300 hover:text-[#C99A43] transition-colors py-1 cursor-pointer w-fit"
                  >
                    <span className="text-xs text-[#C99A43] opacity-60 group-hover:opacity-100 transition-opacity">❖</span>
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#C99A43] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Column 3: Visit Us & Interactive Google Map (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <h4
                  className="text-base sm:text-lg font-bold tracking-[0.14em] text-[#C99A43] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Visit Us
                </h4>
                <span className="h-0.5 w-8 bg-[#C99A43]" />
              </div>

              {/* Embedded Interactive Google Map inside Rounded Container with Gold Border */}
              <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden border-2 border-[#C99A43]/60 shadow-lg bg-[#112239]">
                <iframe
                  title="Buntara Bhavana Guruvayankere Location Map"
                  src="https://maps.google.com/maps?q=Buntara+Bhavana,+Guruvayanakere,+Belthangady,+Karnataka+574217&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Address Text */}
              <div className="mt-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-[#FFF9EE]">X7P4+82X BUNTARA BHAVANA</strong>, Guruvayanakere, Belthangady, Karnataka 574217
                </p>
              </div>

              {/* Open in Google Maps Link */}
              <div className="mt-2.5">
                <a
                  href="https://maps.google.com/?q=Buntara+Bhavana,+Guruvayanakere,+Belthangady,+Karnataka+574217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C99A43] hover:text-[#d8aa52] underline underline-offset-4 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Gold Separator & Center-Aligned Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} <span className="text-[#C99A43] font-semibold">Buntara Bhavana – Guruvayankere</span>. All rights reserved.
            </p>
            <p className="text-center sm:text-right text-gray-400">
              Designed with Tulunadu Cultural Heritage &amp; Traditional Hospitality
            </p>
          </div>
        </div>
      </footer>


      {/* =====================================================================
          MODAL A: EXPLORE HALL DETAILED VIEW (Tailored for Each of the 3 Halls)
         ===================================================================== */}
      {selectedHallForDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="relative h-64 sm:h-72 w-full border-b-2 border-gray-200">
              <VenueImage
                src={selectedHallForDetails.image}
                fallbacks={selectedHallForDetails.fallbackImages}
                variant="hall"
                alt={selectedHallForDetails.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedHallForDetails(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-gray-200 hover:bg-[#741B1B] cursor-pointer"
                aria-label="Close Hall Details"
              >
                <X className="w-5 h-5" />
              </button>
              <span
                className="absolute bottom-3.5 left-4 px-3.5 py-1 rounded-full bg-[#741B1B] text-[#FFF0D5] border border-gray-200 text-xs font-bold tracking-[0.14em]"
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
                  className="text-2xl sm:text-3xl font-extrabold text-gray-800"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {selectedHallForDetails.formattedPrice}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Official Hall Rental
                </span>
              </div>

              <p className="mt-4 text-gray-800 leading-relaxed">
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
                        className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#741B1B] border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                          {renderFacilityBadgeIcon(fac.icon)}
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold text-[#741B1B]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {fac.title}
                          </p>
                          <p className="text-xs text-gray-800/90 mt-0.5 leading-relaxed">
                            {fac.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Venue Highlights */}
              <div className="mt-5 bg-gray-50 p-4 rounded-lg border border-gray-200/60">
                <h4
                  className="text-xs font-bold uppercase tracking-[0.12em] text-[#741B1B] mb-2.5 flex items-center justify-between"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span>Key Venue Highlights</span>
                  <span className="text-[11px] font-normal text-gray-500 lowercase tracking-normal">
                    {(selectedHallForDetails.highlights || []).length} highlights
                  </span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800">
                  {(selectedHallForDetails.highlights || []).map((pt, idx) => (
                    <li key={`${pt}-${idx}`} className="flex items-start gap-2">
                      <span className="text-[#741B1B] font-bold shrink-0">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suitable Functions / Events */}
              {selectedHallForDetails.suitableEvents && (
                <div className="mt-4 bg-gray-50/70 p-4 rounded-lg border border-gray-200/50">
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
                        className="px-3 py-1 rounded-full bg-[#FFF0D5] border border-gray-200 text-xs font-medium text-gray-800"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hall Timings Box (Displayed for Halls with Session Schedules) */}
              {selectedHallForDetails.timings && (
                <div className="mt-4 p-4 rounded-lg bg-[#741B1B] text-[#FFF0D5] border border-gray-200">
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
                  className="px-5 py-2.5 rounded-md border border-[#741B1B] text-[#741B1B] font-bold text-xs tracking-widest uppercase hover:bg-gray-50 cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleOpenBooking(selectedHallForDetails.id)}
                  className="px-6 py-2.5 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-gray-200 font-bold text-xs tracking-widest uppercase shadow-md cursor-pointer"
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
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#741B1B] text-[#FFF0D5] px-6 py-5 border-b-2 border-gray-200 flex items-center justify-between">
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
                className="p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-gray-200/60 hover:border-gray-200 cursor-pointer"
                aria-label="Close Booking Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Body */}
            <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
              {bookingSuccessData ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#741B1B] text-[#C99A43] border-2 border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4
                    className="text-xl sm:text-2xl font-bold text-[#741B1B]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Booking Request Submitted
                  </h4>
                  <p className="mt-2 text-sm sm:text-base text-gray-800 max-w-md mx-auto">
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

                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5 text-left text-sm space-y-2">
                    <div className="flex justify-between border-b border-gray-200/40 pb-2">
                      <span className="text-gray-600 font-semibold">Reference ID:</span>
                      <span className="font-bold text-[#741B1B]">{bookingSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Selected Hall:</span>
                      <span className="font-bold text-right">{bookingSuccessData.hallName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Hall Rental Price:</span>
                      <span className="font-bold text-[#741B1B]">
                        {bookingSuccessData.rentalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Booking Date:</span>
                      <span className="font-bold">{bookingSuccessData.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Selected Session:</span>
                      <span className="font-bold">{bookingSuccessData.session}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Booking Status:</span>
                      <span className="font-bold text-gray-600">
                        Pending (Confirmation after Admin Approval)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="mt-6 px-7 py-3 rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-gray-200 font-bold text-xs tracking-widest uppercase cursor-pointer"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Return to Website
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} autoComplete="off" className="space-y-4">
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900 font-medium">
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#741B1B] focus:border-[#741B1B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="guest_contact_email"
                        id="guest_contact_email"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="abc@gmail.com"
                        value={bookingForm.emailAddress}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, emailAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
                        Type of Function / Event *
                      </label>
                      <select
                        value={bookingForm.eventType}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, eventType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
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

                  {/* Notice: 3 Separate Halls in One Building */}
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50/40 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#741B1B] uppercase tracking-wider block mb-0.5 font-bold">
                        3 Independent Halls Inside Buntara Bhavana Building
                      </strong>
                      All three halls are distinct spaces located within the same Buntara Bhavana complex. Different halls can be reserved simultaneously by different guests for separate events on the same date.
                    </div>
                  </div>

                  {/* Visual 3-Hall Interactive Selector with Live Date Availability */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Choose Hall Space (1 of 3) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {hallsData.map((h) => {
                        const isSelected = bookingForm.hallId === h.id;
                        const isHallBookedOnDate = bookingForm.eventDate
                          ? approvedBookings.some((b) => {
                              const matchHall = b.hallId === h.id;
                              const matchDate = b.date === bookingForm.eventDate;
                              const matchStatus = b.status
                                ? ['pending', 'approved'].includes(b.status.toLowerCase())
                                : true;
                              return matchHall && matchDate && matchStatus;
                            })
                          : false;

                        const hallNumLabel = h.hallTag || (h.id === 'malady-tunga' ? 'Hall 1' : h.id === 'kaashi-shetty' ? 'Hall 2' : 'Hall 3');

                        return (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => setBookingForm({ ...bookingForm, hallId: h.id })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#741B1B] bg-[#741B1B]/5 ring-2 ring-[#741B1B]'
                                : 'border-gray-200 bg-white hover:border-[#C99A43] hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0B192C] text-[#F3CF7A] border border-[#C99A43]/50">
                                  {hallNumLabel}
                                </span>
                                <span className="text-xs font-bold text-[#741B1B]" style={{ fontFamily: "'Cinzel', serif" }}>
                                  {h.formattedPrice}
                                </span>
                              </div>
                              <p className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">
                                {h.name}
                              </p>
                              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                {h.category}
                              </p>
                            </div>

                            {/* Dynamic per-hall status if a date is picked */}
                            {bookingForm.eventDate && (
                              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                                {isHallBookedOnDate ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                    <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                                    Booked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    Available
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-400">
                                  {isSelected ? 'Selected' : 'Click to select'}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date, Session Selection & Live Availability Indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
                        Booking Date *
                      </label>
                      <div
                        onClick={handleOpenDatePicker}
                        className="relative flex items-center cursor-pointer group"
                      >
                        <input
                          ref={bookingDateInputRef}
                          type="date"
                          required
                          min={todayDateString}
                          value={bookingForm.eventDate}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, eventDate: e.target.value })
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              e.currentTarget.showPicker?.();
                            } catch {}
                          }}
                          onFocus={(e) => {
                            try {
                              e.currentTarget.showPicker?.();
                            } catch {}
                          }}
                          style={{ colorScheme: 'light' }}
                          className="w-full relative pl-3.5 pr-10 py-2.5 rounded-md bg-gray-50 border border-gray-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#741B1B] cursor-pointer group-hover:border-[#C99A43] transition-colors"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 flex items-center justify-center text-[#C99A43] group-hover:text-[#741B1B] transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
                        Session Selection *
                      </label>
                      <select
                        value={bookingForm.session}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, session: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
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
                      className={`px-3.5 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2 border ${
                        selectedSlotStatus === 'available'
                          ? 'bg-emerald-950/10 border-emerald-800/40 text-emerald-900'
                          : 'bg-red-950/10 border-red-700/40 text-red-800'
                      }`}
                    >
                      {selectedSlotStatus === 'available' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>
                            <strong>Hall is available:</strong> {selectedHallObj.name} is open for booking on{' '}
                            {bookingForm.eventDate} ({bookingForm.session}).
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                          <span>
                            <strong>This hall is already booked on the selected date:</strong> {selectedHallObj.name} is booked on{' '}
                            {bookingForm.eventDate}. Please select another date or choose a different hall.
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                      />
                    </div>

                    <div className="flex items-end">
                      <p className="text-xs text-gray-600 italic pb-2">
                        Timings and availability are finalized upon management confirmation.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">
                      Additional Requirements / Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share any specific ceremony timings, dining hall needs, or questions..."
                      value={bookingForm.additionalMessage}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, additionalMessage: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#741B1B]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-600 italic">
                      * Booking remains Pending until approved by Buntara Bhavana administration.
                    </p>
                    <button
                      type="submit"
                      disabled={selectedSlotStatus === 'unavailable'}
                      className={`w-full sm:w-auto px-7 py-3 rounded-md font-bold text-xs tracking-[0.12em] uppercase shadow-md transition-all ${
                        selectedSlotStatus === 'unavailable'
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed border border-gray-300 opacity-60'
                          : 'bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-gray-200 cursor-pointer'
                      }`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {selectedSlotStatus === 'unavailable' ? 'HALL NOT AVAILABLE' : 'SUBMIT ENQUIRY'}
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
          <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#741B1B] text-[#FFF0D5] px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
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
                className="p-2 rounded-full bg-[#5A1015] text-[#FFF0D5] border border-gray-200/60 hover:border-gray-200 cursor-pointer"
                aria-label="Close Dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto">
              {/* ABOUT VIEW */}
              {activeInfoModal === 'about' && (
                <div className="space-y-4 text-gray-800 leading-relaxed">
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
                  <p className="text-sm sm:text-base text-gray-800 mb-6">
                    {siteContent.facilitiesIntro}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facilitiesData.map(({ id, title, subtitle, description, icon: Icon }) => (
                      <div
                        key={id}
                        className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-3.5"
                      >
                        <div className="w-11 h-11 rounded-full bg-[#741B1B] text-[#C99A43] border border-gray-200 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4
                            className="text-sm font-bold text-[#741B1B]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {title}
                          </h4>
                          <p className="text-xs font-semibold text-gray-600 mt-0.5">
                            {subtitle}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-800/90 mt-1.5 leading-relaxed">
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
                    <span className="text-xs text-gray-600">
                      Venue photos and galleries managed by administration.
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
                        className="rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex flex-col justify-between"
                      >
                        <VenueImage
                          src={photo.img}
                          fallbacks={photo.fallbacks}
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
                        className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <h5
                          className="font-bold text-[#741B1B]"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {ev.title}
                        </h5>
                        <p className="mt-1.5 text-gray-800/90">{ev.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT VIEW */}
              {activeInfoModal === 'contact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-3">
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

                  <div className="bg-[#741B1B] text-[#FFF0D5] p-5 rounded-lg border-2 border-gray-200 flex flex-col justify-between">
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
                      className="mt-5 w-full py-3 rounded-md bg-[#C99A43] hover:bg-[#d8aa52] text-gray-800 font-bold text-xs tracking-widest uppercase cursor-pointer"
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
      {/* =====================================================================
          HOME PAGE ENTRY "BOOK NOW" POP-UP MODAL (Royal Navy & Gold Theme)
         ===================================================================== */}
      {entryPopUpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setEntryPopUpOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0B192C] text-[#FFF9EE] rounded-2xl border-2 border-[#C99A43] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button
              onClick={() => setEntryPopUpOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sacred Temple Logo */}
            <div className="flex justify-center mb-3">
              <TempleLogoSVG className="w-14 h-14 drop-shadow-[0_0_16px_rgba(201,154,67,0.55)]" />
            </div>

            <p
              className="text-xs font-semibold tracking-[0.25em] text-[#C99A43] uppercase mb-1"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Namaskara • Welcome to
            </p>

            <h3
              className="text-2xl sm:text-3xl font-bold text-[#FFF9EE] tracking-wide mb-3"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              BUNTARA BHAVANA
            </h3>

            <div className="flex justify-center mb-4">
              <GoldOrnamentalDivider />
            </div>

            <p
              className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Plan your grand weddings, sacred muhurthams, and cherished family gatherings in our prestigious air-conditioned and traditional banquet halls in Guruvayankere.
            </p>

            {/* Prominent Golden Book Now CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEntryPopUpOpen(false);
                  handleOpenBooking('malady-tunga');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C99A43] hover:bg-[#d8aa52] text-[#0B192C] font-bold text-sm tracking-[0.14em] uppercase rounded-lg shadow-lg border border-[#FFF0D5]/50 transition-all transform hover:scale-[1.02] cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Book Now
              </button>
              <button
                onClick={() => setEntryPopUpOpen(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-gray-400/40 text-gray-300 hover:text-white hover:border-gray-200 text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer"
              >
                Explore Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW-ONLY GALLERY LIGHTBOX PREVIEW MODAL
         ===================================================================== */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0B192C] text-[#FFF9EE] rounded-2xl overflow-hidden border-2 border-[#C99A43] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#C99A43]/40 bg-[#112239]">
              <h3 className="text-base sm:text-lg font-bold text-[#FFF9EE]" style={{ fontFamily: "'Cinzel', serif" }}>
                {activeLightboxImage.title}
              </h3>
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black/60 p-4">
              <img
                src={activeLightboxImage.imageUrl}
                alt={activeLightboxImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}