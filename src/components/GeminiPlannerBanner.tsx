import React from 'react';
import { Sparkles, ArrowRight, DollarSign, HeartHandshake } from 'lucide-react';
import { GEMINI_MODEL_DEFAULT } from '../lib/gemini';

interface GeminiPlannerBannerProps {
  onOpenPlanner: () => void;
  onOpenConcierge: () => void;
}

export const GeminiPlannerBanner: React.FC<GeminiPlannerBannerProps> = ({
  onOpenPlanner,
  onOpenConcierge
}) => {
  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#5A1015] via-[#741B1B] to-[#48251B] text-white border-y border-gray-200 shadow-lg overflow-hidden">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C99A43]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Heading & Description */}
        <div className="space-y-3 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C99A43]/20 border border-[#C99A43]/70 text-[#F3CF7A] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Event & Muhurtham Intelligence</span>
            <span className="text-[10px] opacity-75 font-mono">({GEMINI_MODEL_DEFAULT})</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white uppercase leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Plan Your Auspicious Celebration with Google Gemini AI
          </h2>

          <p
            className="text-sm sm:text-base text-[#FFF0D5]/90 leading-relaxed font-serif"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Planning a grand Tulunadu wedding, intimate engagement, or cultural festival in Guruvayankere?
            Let our Gemini AI assistant recommend the optimal hall, calculate an itemized catering & stage budget,
            and draft traditional invitation wording in seconds.
          </p>

          {/* Key Pill Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-[#F3CF7A]">
            <span className="inline-flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-md border border-[#C99A43]/40">
              <Sparkles className="w-3 h-3 text-[#C99A43]" /> Capacity Matching
            </span>
            <span className="inline-flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-md border border-[#C99A43]/40">
              <DollarSign className="w-3 h-3 text-[#C99A43]" /> Real-time Budget Estimation
            </span>
            <span className="inline-flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-md border border-[#C99A43]/40">
              <HeartHandshake className="w-3 h-3 text-[#C99A43]" /> Auspicious Muhurtham Timings
            </span>
          </div>
        </div>

        {/* Right Column: CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenPlanner}
            className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-lg bg-white hover:bg-gray-100 text-[#741B1B] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl border border-white/60 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <Sparkles className="w-4 h-4 text-[#741B1B]" />
            <span>Launch AI Event Planner</span>
            <ArrowRight className="w-4 h-4 text-[#741B1B]" />
          </button>

          <button
            onClick={onOpenConcierge}
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-lg bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm tracking-wider uppercase border border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span>Ask 24/7 AI Concierge</span>
          </button>
        </div>
      </div>
    </section>
  );
};
