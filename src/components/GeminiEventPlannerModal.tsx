import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  DollarSign,
  HeartHandshake,
  Key,
  X,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import {
  generateGeminiEventPlan,
  hasGeminiApiKey,
  GEMINI_MODEL_DEFAULT
} from '../lib/gemini';
import type { EventPlanRequest, EventPlanResult } from '../lib/gemini';

interface GeminiEventPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookHall: (hallId: string, eventType?: string, guestCount?: number, notes?: string) => void;
  onOpenSettings: () => void;
}

const EVENT_TYPES = [
  'Grand Wedding & Reception',
  'Traditional Wedding / Lagna',
  'Engagement Ceremony (Nischitartha)',
  'Naming Ceremony (Namakarana)',
  'Roce / Mehendi Celebration',
  'Birthday & Milestone Celebration',
  'Cultural Programme / Yakshagana',
  'Community Convention / Meeting'
];

export const GeminiEventPlannerModal: React.FC<GeminiEventPlannerModalProps> = ({
  isOpen,
  onClose,
  onBookHall,
  onOpenSettings
}) => {
  const [formData, setFormData] = useState<EventPlanRequest>({
    eventType: 'Grand Wedding & Reception',
    guestCount: 650,
    session: 'morning',
    budgetPreference: 'traditional-grand',
    specialRequirements: 'Senior citizen lift access needed for elderly grandparents, traditional Tulunadu banana-leaf banquet',
    preferredDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EventPlanResult | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [hasApiKey] = useState(hasGeminiApiKey());

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const plan = await generateGeminiEventPlan(formData);
      setResult(plan);
    } catch (err) {
      console.error('Error generating event plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInvite = () => {
    if (!result) return;
    const text = `${result.invitationDraft.english}\n\n---\n${result.invitationDraft.kannadaOrTransliteration}`;
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleCopyPlan = () => {
    if (!result) return;
    const text = `BUNTARA BHAVANA GURUVAYANKERE - EVENT PLAN
Generated with Google Gemini AI (${GEMINI_MODEL_DEFAULT})

RECOMMENDED HALL: ${result.recommendedHallName} (${result.hallFormattedPrice})
ESTIMATED TOTAL BUDGET: ₹${result.budgetBreakdown.estimatedTotal.toLocaleString('en-IN')}

SUMMARY:
${result.executiveSummary}

BUDGET BREAKDOWN:
- Hall Tariff: ₹${result.budgetBreakdown.hallRental.toLocaleString('en-IN')}
- Traditional Catering (${formData.guestCount} guests @ ₹${result.budgetBreakdown.estimatedCateringPerPlate}/plate): ₹${result.budgetBreakdown.estimatedTotalCatering.toLocaleString('en-IN')}
- Stage Decor: ₹${result.budgetBreakdown.estimatedStageDecor.toLocaleString('en-IN')}
- Audio & Lighting: ₹${result.budgetBreakdown.estimatedSoundAndLighting.toLocaleString('en-IN')}
Total: ₹${result.budgetBreakdown.estimatedTotal.toLocaleString('en-IN')}

SCHEDULE:
${result.scheduleTimeline.map((s) => `${s.time}: ${s.activity} (${s.notes})`).join('\n')}

INVITATION:
${result.invitationDraft.english}
`;
    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const handleBookNow = () => {
    if (!result) return;
    const notes = `AI Plan: ${formData.eventType} for ~${formData.guestCount} guests. Recommended: ${result.recommendedHallName}. Total Est: ₹${result.budgetBreakdown.estimatedTotal.toLocaleString('en-IN')}`;
    onBookHall(result.recommendedHallId, formData.eventType, formData.guestCount, notes);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-gradient-to-r from-[#5A1015] via-[#741B1B] to-[#5A1015] text-[#FFF0D5] border-b-2 border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C99A43]/20 border border-gray-200 text-[#F3CF7A] shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#C99A43] font-bold">
                  Powered by Google Gemini
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white/15 text-[#FFF0D5] rounded border border-gray-200/40">
                  {GEMINI_MODEL_DEFAULT}
                </span>
              </div>
              <h2
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-wider uppercase text-[#FFF0D5]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Tulunadu AI Event & Muhurtham Planner
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 text-[#FFF0D5]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Gemini API Key Settings"
              aria-label="Gemini API Key Settings"
            >
              <Key className="w-4 h-4 text-[#C99A43]" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#FFF0D5]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Introductory Banner */}
          <div className="bg-gradient-to-r from-[#F8E7C8] via-[#FFF0D5] to-[#F8E7C8] p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#A64B2A] shrink-0" />
              <div>
                <p className="font-semibold text-[#741B1B]">
                  Plan Your Auspicious Celebration with Heritage Precision
                </p>
                <p className="text-[11px] sm:text-xs text-[#741B1B]/80 mt-0.5">
                  Gemini analyzes your guest count, session timings, and Tulunadu traditions to recommend the optimal hall, itemized budget, and traditional schedule.
                </p>
              </div>
            </div>
            {!hasApiKey && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-2.5 py-1 text-[11px] font-semibold text-[#741B1B] bg-white/70 hover:bg-white border border-gray-200 rounded shadow-xs shrink-0 cursor-pointer"
              >
                Connect API Key
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="bg-white/80 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#741B1B]" style={{ fontFamily: "'Cinzel', serif" }}>
              1. Tell Us About Your Celebration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                  Event Category
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A43]"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                  Expected Guest Count
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={20}
                      max={3000}
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) || 100 })}
                      className="w-full px-3.5 py-2 pl-9 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A43]"
                    />
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-[#A64B2A]" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[150, 450, 750, 1000].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setFormData({ ...formData, guestCount: count })}
                        className={`px-2 py-1.5 text-xs font-semibold rounded border ${
                          formData.guestCount === count
                            ? 'bg-[#741B1B] text-[#FFF0D5] border-[#741B1B]'
                            : 'bg-white text-[#741B1B] border-gray-200 hover:bg-gray-50'
                        } cursor-pointer transition-colors`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                  Preferred Session
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'morning', label: 'Morning', sub: '10 AM – 2:30 PM' },
                    { id: 'evening', label: 'Evening', sub: '6 PM – 10 PM' },
                    { id: 'full-day', label: 'Full Day', sub: 'Auspicious Wedding' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, session: s.id as any })}
                      className={`px-2.5 py-2 rounded-lg text-left border text-xs font-semibold cursor-pointer transition-all ${
                        formData.session === s.id
                          ? 'bg-[#741B1B] text-[#FFF0D5] border-[#741B1B] shadow-sm'
                          : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold">{s.label}</div>
                      <div className={`text-[10px] ${formData.session === s.id ? 'text-[#F3CF7A]' : 'text-[#741B1B]/70'}`}>
                        {s.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                  Celebration Scale & Catering
                </label>
                <select
                  value={formData.budgetPreference}
                  onChange={(e) => setFormData({ ...formData, budgetPreference: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A43]"
                >
                  <option value="traditional-grand">Traditional Grand (Classic Tulunadu Oota & Decor)</option>
                  <option value="royal-heritage">Royal Heritage (Premium Multi-course Feast & Grand Stage)</option>
                  <option value="budget-conscious">Comfortable / Essential (Optimum Costs)</option>
                </select>
              </div>
            </div>

            {/* Special notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B] mb-1">
                Special Requests or Ritual Requirements
              </label>
              <input
                type="text"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="e.g. Lift access for senior citizens, traditional Moode & Payasa catering, Nadaswaram stage..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A43]"
              />
            </div>

            {/* Generate Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#741B1B] to-[#5A1015] hover:from-[#5A1015] hover:to-[#741B1B] text-[#FFF0D5] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase shadow-md border border-gray-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border border-gray-200 border-t-transparent rounded-full animate-spin" />
                    <span>Gemini is Crafting Your Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F3CF7A]" />
                    <span>Generate Auspicious Event Plan with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Result Section */}
          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Recommended Hall Card */}
              <div className="bg-gradient-to-br from-[#5A1015] via-[#741B1B] to-[#48251B] p-5 sm:p-6 rounded-2xl border border-gray-200 text-[#FFF0D5] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
                  <Award className="w-48 h-48 text-[#C99A43]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/40 pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C99A43]/30 border border-gray-200 text-xs font-bold text-[#F3CF7A] uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Recommended Hall
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-bold tracking-wide text-white uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {result.recommendedHallName}
                    </h3>
                  </div>

                  <div className="text-left md:text-right bg-black/25 px-4 py-2.5 rounded-xl border border-gray-200">
                    <span className="text-[11px] uppercase tracking-wider text-[#C99A43] block">Tariff</span>
                    <span
                      className="text-2xl sm:text-3xl font-extrabold text-[#F3CF7A]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {result.hallFormattedPrice}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-4 space-y-2 text-sm text-[#FFF0D5]/90">
                  <p className="font-semibold text-white leading-relaxed">{result.executiveSummary}</p>
                  <p className="text-xs text-[#FFF0D5]/80">{result.whyThisHall}</p>
                </div>

                {/* Pre-fill & Book CTA right here */}
                <div className="relative z-10 mt-5 pt-4 border-t border-gray-200/30 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#F3CF7A]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Includes separate dining hall, senior citizen lift, & parking</span>
                  </div>
                  <button
                    onClick={handleBookNow}
                    className="px-5 py-2.5 rounded-lg bg-[#C99A43] hover:bg-[#d8aa52] text-gray-900 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <span>Proceed to Book This Hall</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Budget Breakdown & Schedule Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Breakdown */}
                <div className="bg-white/80 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-200/30 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#A64B2A]" />
                        <h4
                          className="font-bold text-sm tracking-wider uppercase text-[#741B1B]"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Estimated Budget Breakdown
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-[#A64B2A]">
                        ~{formData.guestCount} Guests
                      </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between py-1 border-b border-[#F8E7C8]">
                        <span className="text-gray-700">Hall Rental (Confirmed Tariff)</span>
                        <span className="font-bold text-[#741B1B]">
                          ₹{result.budgetBreakdown.hallRental.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#F8E7C8]">
                        <div>
                          <span className="text-gray-700 block">Traditional Vegetarian Catering (Sadya)</span>
                          <span className="text-[10px] text-[#A64B2A]">
                            ~₹{result.budgetBreakdown.estimatedCateringPerPlate}/plate for {formData.guestCount} guests
                          </span>
                        </div>
                        <span className="font-bold text-[#741B1B]">
                          ₹{result.budgetBreakdown.estimatedTotalCatering.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#F8E7C8]">
                        <span className="text-gray-700">Floral Stage & Mandap Decor (Est.)</span>
                        <span className="font-bold text-[#741B1B]">
                          ₹{result.budgetBreakdown.estimatedStageDecor.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#F8E7C8]">
                        <span className="text-gray-700">Nadaswaram, Audio & Lighting (Est.)</span>
                        <span className="font-bold text-[#741B1B]">
                          ₹{result.budgetBreakdown.estimatedSoundAndLighting.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#741B1B]">
                      Estimated Total Investment:
                    </span>
                    <span
                      className="text-lg sm:text-xl font-bold text-[#741B1B]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      ₹{result.budgetBreakdown.estimatedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Auspicious Timeline */}
                <div className="bg-white/80 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 border-b border-gray-200/30 pb-3 mb-4">
                      <Clock className="w-5 h-5 text-[#A64B2A]" />
                      <h4
                        className="font-bold text-sm tracking-wider uppercase text-[#741B1B]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Auspicious Event Timeline ({formData.session.toUpperCase()} Session)
                      </h4>
                    </div>

                    <div className="space-y-3.5 relative pl-4 border-l-2 border-gray-200/40">
                      {result.scheduleTimeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#C99A43] border-2 border-white" />
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-[#A64B2A] font-mono">{step.time}</span>
                            <span className="text-xs sm:text-sm font-bold text-[#741B1B]">{step.activity}</span>
                          </div>
                          <p className="text-[11px] text-gray-700 mt-0.5 leading-relaxed">{step.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Traditional Invitation Draft */}
              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200/40 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-[#741B1B]" />
                    <h4
                      className="font-bold text-sm tracking-wider uppercase text-[#741B1B]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Bespoke Traditional Invitation Draft
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyInvite}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-[#741B1B] text-[#FFF0D5] hover:bg-[#5A1015] transition-colors cursor-pointer"
                  >
                    {copiedInvite ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Invitation</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed text-gray-900">
                  <div className="bg-white p-4 rounded-lg border border-gray-200/40 whitespace-pre-line shadow-xs">
                    <div className="text-[10px] font-sans font-bold text-[#A64B2A] uppercase mb-1">
                      English Draft
                    </div>
                    {result.invitationDraft.english}
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200/40 whitespace-pre-line shadow-xs">
                    <div className="text-[10px] font-sans font-bold text-[#A64B2A] uppercase mb-1">
                      Kannada Draft
                    </div>
                    {result.invitationDraft.kannadaOrTransliteration}
                  </div>
                </div>
              </div>

              {/* Venue Heritage Logistics Tips */}
              <div className="bg-white/80 p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
                <h4
                  className="font-bold text-xs uppercase tracking-wider text-[#741B1B] flex items-center gap-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Building2 className="w-4 h-4 text-[#C99A43]" /> Essential Venue Tips for Guruvayankere
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  {result.venueTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/50 p-2.5 rounded-lg border border-gray-200/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C99A43] shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/40">
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#741B1B] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {copiedPlan ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPlan ? 'Plan Copied!' : 'Copy Full Plan to Clipboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#741B1B] to-[#5A1015] hover:from-[#5A1015] hover:to-[#741B1B] text-[#FFF0D5] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg border border-gray-200 flex items-center gap-2 cursor-pointer transition-all"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span>Pre-Fill & Confirm Booking</span>
                  <ArrowRight className="w-4 h-4 text-[#F3CF7A]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
