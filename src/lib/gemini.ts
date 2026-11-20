import { GoogleGenAI } from '@google/genai';

/**
 * BUNTARA BHAVANA GURUVAYANKERE - GEMINI API INTEGRATION
 * Powered by Google Gemini 4 Hydrogen / 3.5 Flash-Lite via the official @google/genai SDK
 */

// Model constants following modern Gemini SDK guidelines
export const GEMINI_MODEL_DEFAULT = 'gemini-4-hydrogen';
export const GEMINI_MODEL_FAST = 'gemini-3.5-flash-lite';

export interface EventPlanRequest {
  eventType: string;
  guestCount: number;
  session: 'morning' | 'evening' | 'full-day';
  budgetPreference?: 'budget-conscious' | 'traditional-grand' | 'royal-heritage';
  specialRequirements?: string;
  preferredDate?: string;
}

export interface EventPlanResult {
  recommendedHallId: 'malady-tunga' | 'kaashi-shetty' | 'arvaguthu-mini';
  recommendedHallName: string;
  hallPrice: number;
  hallFormattedPrice: string;
  executiveSummary: string;
  whyThisHall: string;
  budgetBreakdown: {
    hallRental: number;
    estimatedCateringPerPlate: number;
    estimatedTotalCatering: number;
    estimatedStageDecor: number;
    estimatedSoundAndLighting: number;
    estimatedTotal: number;
    notes: string;
  };
  scheduleTimeline: Array<{
    time: string;
    activity: string;
    notes: string;
  }>;
  invitationDraft: {
    english: string;
    kannadaOrTransliteration: string;
  };
  venueTips: string[];
  rawGeminiResponse?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

// Hall metadata for venue grounding
export const VENUE_CONTEXT = `
You are the official Heritage Event Concierge for "BUNTARA BHAVANA", located in Guruvayankere, Belthangady Taluk, Dakshina Kannada District, Karnataka, India (Tulunadu region).
Buntara Bhavana is a landmark traditional South Indian and Tulunadu cultural and wedding venue renowned for its temple-inspired architecture, gracious hospitality, and top-tier amenities.

VENUE FACTS & SPECIFICATIONS:
1. Malady Tunga and Mundappa Shetty Vedike (AC Hall):
   - Category: AC Hall (Fully Air-Conditioned Grand Celebration Hall)
   - Tariff: ₹75,000 per booking
   - Capacity: 600 to 1,200+ guests
   - Best for: Grand Weddings, Receptions, Large Family Celebrations, State-level conventions
   - Highlights: Elegant air conditioning, separate dining hall access, lift facility for senior citizens, grand stage lighting, spacious seating, parking.
   - Timings: Morning (10:00 AM – 2:30 PM), Evening (6:00 PM – 10:00 PM), or Full Day by arrangement.

2. Kaashi Shetty Vedike (Non-AC Hall):
   - Category: Non-AC Hall (Spacious & Naturally Ventilated Traditional Hall)
   - Tariff: ₹35,000 per booking
   - Capacity: 350 to 700 guests
   - Best for: Traditional Weddings, Receptions, Cultural Programs, Yakshagana performances, Seemantha / Baby Showers, Community Gatherings
   - Highlights: Natural cross-ventilation, separate dining hall, lift access for elderly, authentic Tulunadu wood-and-pillar aesthetics, parking.
   - Timings: Morning & Evening sessions available.

3. Arvaguthu K. Narayana Rai Vedike (Mini Hall):
   - Category: Mini Hall (Intimate Celebrations & Gatherings)
   - Tariff: ₹12,000 per booking
   - Capacity: 80 to 200 guests
   - Best for: Engagement Ceremonies (Nischitartha), Naming Ceremonies (Namakarana), Upanayana, Birthday Celebrations, Family Meetings, Small Traditional Poojas
   - Highlights: Compact, cozy, comfortable, convenient dining hall access, budget-friendly.
   - Timings: Morning Session (8:00 AM – 3:00 PM), Evening Session (6:00 PM – 10:30 PM).

SHARED AMENITIES:
- Separate dedicated traditional dining hall for traditional vegetarian banana leaf feast (Tulunadu Oota / Sadya).
- Modern passenger lift facility dedicated for senior citizens and elderly family members.
- Ample on-premise vehicle parking for cars and two-wheelers.
- Close proximity to Dharmasthala (approx. 20 km) and Belthangady town (approx. 4 km).
- Authentic South Indian / Tulunadu cultural ethos: invocations to Sri Manjunatha Swamy of Dharmasthala and Sri Durgaparameshwari of Kateel are customary.
- Strictly pure vegetarian catering in dining facilities as per venue customs.

BEHAVIOR GUIDELINES:
- Be warm, gracious, respectful, and culturally knowledgeable about Tulunadu customs (Bunt culture, Muhurtham rituals, Baale Enne, traditional feast hospitality).
- Always recommend the most appropriate hall based on guest count and event nature.
- When generating budgets, calculate realistic Tulunadu catering rates (typically ₹180 - ₹350 per banana leaf plate for traditional vegetarian feasts) plus hall rent and decor.
- Answer user queries accurately based strictly on verified venue data.
`;

// Retrieve API key from environment or localStorage for runtime flexibility
export const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('buntara_gemini_api_key')?.trim();
    if (local && local.length > 10 && !local.startsWith('your-')) return local;
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (envKey && envKey.length > 10 && !envKey.startsWith('your-')) return envKey;
  return '';
};

export const setStoredGeminiApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('buntara_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('buntara_gemini_api_key');
    }
  }
};

export const hasGeminiApiKey = (): boolean => {
  const key = getGeminiApiKey();
  return Boolean(key && !key.startsWith('your-') && key.length > 10);
};

export const getGeminiClient = (apiKeyOverride?: string): GoogleGenAI | null => {
  const key = apiKeyOverride?.trim() || getGeminiApiKey();
  if (!key || key.startsWith('your-') || key.length < 10) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
};

/**
 * Intelligent Curated Fallback Plan for offline or demo use
 */
export const getCuratedEventPlan = (req: EventPlanRequest): EventPlanResult => {
  const guests = req.guestCount || 300;
  let hallId: 'malady-tunga' | 'kaashi-shetty' | 'arvaguthu-mini' = 'kaashi-shetty';
  let hallName = 'Kaashi Shetty Vedike (Non-AC Hall)';
  let price = 35000;
  let formattedPrice = '₹35,000';

  if (guests > 550 || req.eventType.toLowerCase().includes('grand') || req.budgetPreference === 'royal-heritage') {
    hallId = 'malady-tunga';
    hallName = 'Malady Tunga and Mundappa Shetty Vedike (AC Hall)';
    price = 75000;
    formattedPrice = '₹75,000';
  } else if (guests <= 200 || req.eventType.toLowerCase().includes('naming') || req.eventType.toLowerCase().includes('engagement')) {
    hallId = 'arvaguthu-mini';
    hallName = 'Arvaguthu K. Narayana Rai Vedike (Mini Hall)';
    price = 12000;
    formattedPrice = '₹12,000';
  }

  const perPlate = req.budgetPreference === 'royal-heritage' ? 320 : req.budgetPreference === 'traditional-grand' ? 260 : 200;
  const totalCatering = guests * perPlate;
  const stageDecor = hallId === 'malady-tunga' ? 35000 : hallId === 'kaashi-shetty' ? 20000 : 10000;
  const soundLight = hallId === 'malady-tunga' ? 15000 : 8000;
  const totalEst = price + totalCatering + stageDecor + soundLight;

  return {
    recommendedHallId: hallId,
    recommendedHallName: hallName,
    hallPrice: price,
    hallFormattedPrice: formattedPrice,
    executiveSummary: `For your ${req.eventType} with approximately ${guests} guests, we recommend the ${hallName}. This venue provides the perfect capacity, comfortable guest seating, seamless dining access, and authentic Tulunadu heritage charm.`,
    whyThisHall: `With ${guests} attendees, ${hallName} offers ideal comfort without overcrowding. Guests enjoy dedicated lift accessibility for elders, direct entry to the traditional dining hall, and ample parking on-premises.`,
    budgetBreakdown: {
      hallRental: price,
      estimatedCateringPerPlate: perPlate,
      estimatedTotalCatering: totalCatering,
      estimatedStageDecor: stageDecor,
      estimatedSoundAndLighting: soundLight,
      estimatedTotal: totalEst,
      notes: 'Estimates reflect traditional South Indian vegetarian banana leaf feast (Oota) and professional floral stage decor. Final vendor charges vary based on specific menu selection.'
    },
    scheduleTimeline: [
      {
        time: req.session === 'evening' ? '5:30 PM' : '8:30 AM',
        activity: 'Auspicious Diya Lighting & Welcome',
        notes: 'Welcoming family members with traditional Panak, tender coconut water, and fragrant jasmine garlands.'
      },
      {
        time: req.session === 'evening' ? '6:30 PM' : '10:15 AM',
        activity: 'Main Ritual / Muhurtham Ceremony',
        notes: 'Sacred ceremonies on the grand stage with traditional Nadaswaram and divine blessings.'
      },
      {
        time: req.session === 'evening' ? '8:00 PM' : '12:30 PM',
        activity: 'Traditional Tulunadu Banana Leaf Feast (Oota)',
        notes: 'Delicious vegetarian banquet served in the dedicated separate dining hall (Moode, Payasa, Holige, Sambar, Rasam, Majjige).'
      },
      {
        time: req.session === 'evening' ? '9:30 PM' : '2:15 PM',
        activity: 'Felicitation & Warm Farewell',
        notes: 'Photo sessions with guests, distribution of Tambula/return gifts, and wrapping up the auspicious celebration.'
      }
    ],
    invitationDraft: {
      english: `|| Sri Manjunatha Swamy Prasanna ||\n|| Sri Durgaparameshwari Prasanna ||\n\nWith the divine blessings of Almighty and elders, we cordially invite you and your family to grace the auspicious ${req.eventType} celebration.\n\nVenue: ${hallName}\nBuntara Bhavana, Guruvayankere, Belthangady Taluk\nDate & Session: ${req.preferredDate || 'Auspicious Date'} (${req.session.toUpperCase()} Session)\n\nWe look forward to welcoming you with warm Tulunadu hospitality.\n\nWarm Regards,\nThe Family`,
      kannadaOrTransliteration: `|| ಶ್ರೀ ಮಂಜುನಾಥ ಸ್ವಾಮಿ ಪ್ರಸನ್ನ ||\n|| ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿ ಪ್ರಸನ್ನ ||\n\nನಮ್ಮ ಕುಟುಂಬದ ಶುಭ ಸಮಾರಂಭವಾದ "${req.eventType}" ಕ್ಕೆ ತಾವೂ ಹಾಗೂ ತಮ್ಮ ಕುಟುಂಬದವರೆಲ್ಲರೂ ಆಗಮಿಸಿ ನವದಂಪತಿಗಳನ್ನು / ಸಮಾರಂಭವನ್ನು ಆಶೀರ್ವದಿಸಬೇಕಾಗಿ ವಿನಂತಿಸುತ್ತೇವೆ.\n\nಸ್ಥಳ: ${hallName},\nಬಂಟರ ಭವನ, ಗುರುವಾಯನಕೆರೆ, ಬೆಳ್ತಂಗಡಿ ತಾಲೂಕು.\n\nತಮ್ಮ ಆಗಮನವನ್ನು ಬಯಸುವ,\nಕುಟುಂಬಸ್ಥರು`
    },
    venueTips: [
      'Elderly guests can conveniently use the elevator/lift situated near the main entrance to reach both the celebration stage and dining hall.',
      'Ample parking is available for four-wheelers and two-wheelers inside the premises.',
      'Catering in the dining hall must strictly adhere to pure vegetarian traditions.',
      'For evening events, golden hour photography in the front courtyard with the traditional architectural facade creates stunning heritage memories.'
    ]
  };
};

/**
 * Generate Event Plan with Gemini API (Interactions API)
 */
export const generateGeminiEventPlan = async (
  req: EventPlanRequest,
  apiKeyOverride?: string
): Promise<EventPlanResult> => {
  const client = getGeminiClient(apiKeyOverride);

  // If no Gemini client is configured, return the high-quality curated plan
  if (!client) {
    return getCuratedEventPlan(req);
  }

  const prompt = `
Generate a comprehensive, culturally rich Event Plan and Budget Recommendation for an event at Buntara Bhavana, Guruvayankere.

EVENT DETAILS:
- Event Type: ${req.eventType}
- Expected Guest Count: ${req.guestCount}
- Preferred Session: ${req.session}
- Preferred Date: ${req.preferredDate || 'To be finalized'}
- Budget Preference: ${req.budgetPreference || 'traditional-grand'}
- Special Requirements: ${req.specialRequirements || 'None specified'}

INSTRUCTIONS:
1. Select the BEST hall among:
   - "malady-tunga" (Malady Tunga and Mundappa Shetty Vedike - AC Hall, ₹75,000) for 600+ guests or grand AC celebrations.
   - "kaashi-shetty" (Kaashi Shetty Vedike - Non-AC Hall, ₹35,000) for 350-700 guests, natural ventilation, cultural events.
   - "arvaguthu-mini" (Arvaguthu K. Narayana Rai Vedike - Mini Hall, ₹12,000) for intimate events under 200 guests.
2. Provide a realistic budget breakdown including hall rental, traditional Tulunadu vegetarian banana leaf feast (Oota) per-plate and total cost, stage decor, sound/lights.
3. Provide a traditional itinerary/timeline suitable for Tulunadu heritage (e.g. Baale Enne, Muhurtham, Oota, Panak welcome).
4. Provide elegant traditional invitation card draft text in both English and Kannada/Kannada script (with blessings of Sri Manjunatha Swamy & Sri Durgaparameshwari).
5. Provide 4 actionable tips for hosting at Buntara Bhavana Guruvayankere.

Return your response strictly in valid JSON format matching this schema:
{
  "recommendedHallId": "malady-tunga" | "kaashi-shetty" | "arvaguthu-mini",
  "recommendedHallName": "Full Hall Name",
  "hallPrice": 75000 | 35000 | 12000,
  "hallFormattedPrice": "₹75,000" | "₹35,000" | "₹12,000",
  "executiveSummary": "2-3 sentences overview",
  "whyThisHall": "Detailed reason why this hall is ideal for the guest count and event",
  "budgetBreakdown": {
    "hallRental": number,
    "estimatedCateringPerPlate": number,
    "estimatedTotalCatering": number,
    "estimatedStageDecor": number,
    "estimatedSoundAndLighting": number,
    "estimatedTotal": number,
    "notes": "string"
  },
  "scheduleTimeline": [
    { "time": "string", "activity": "string", "notes": "string" }
  ],
  "invitationDraft": {
    "english": "string",
    "kannadaOrTransliteration": "string"
  },
  "venueTips": [
    "string", "string", "string", "string"
  ]
}
`;

  try {
    const interaction = await client.interactions.create({
      model: GEMINI_MODEL_DEFAULT,
      system_instruction: VENUE_CONTEXT,
      input: prompt
    });

    const outputText = interaction.output_text?.trim() || '';
    if (!outputText) {
      throw new Error('Empty response received from Gemini API');
    }

    // Clean JSON markdown fences if present
    const cleanedJson = outputText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanedJson) as EventPlanResult;
    parsed.rawGeminiResponse = outputText;
    return parsed;
  } catch (primaryErr) {
    console.warn(`Primary Gemini model (${GEMINI_MODEL_DEFAULT}) error, trying ${GEMINI_MODEL_FAST}:`, primaryErr);
    try {
      // Fallback to faster model
      const fallbackInteraction = await client.interactions.create({
        model: GEMINI_MODEL_FAST,
        system_instruction: VENUE_CONTEXT,
        input: prompt
      });
      const outputText = fallbackInteraction.output_text?.trim() || '';
      const cleanedJson = outputText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      const parsed = JSON.parse(cleanedJson) as EventPlanResult;
      parsed.rawGeminiResponse = outputText;
      return parsed;
    } catch (fallbackErr) {
      console.error('All Gemini API calls failed, falling back to curated plan:', fallbackErr);
      const fallbackPlan = getCuratedEventPlan(req);
      fallbackPlan.executiveSummary = `[Note: Generated using local venue intelligence. Set or check your Gemini API Key in settings for live AI inference.] ${fallbackPlan.executiveSummary}`;
      return fallbackPlan;
    }
  }
};

/**
 * Send Conversational Message to Gemini Concierge (Interactions API with stateful memory)
 */
export const sendGeminiConciergeMessage = async (
  userMessage: string,
  previousInteractionId?: string,
  apiKeyOverride?: string
): Promise<{ replyText: string; interactionId: string }> => {
  const client = getGeminiClient(apiKeyOverride);

  if (!client) {
    // Intelligent local conversational assistant reply when API key is not yet set
    const lower = userMessage.toLowerCase();
    let reply = '';

    if (lower.includes('price') || lower.includes('cost') || lower.includes('rent') || lower.includes('tariff')) {
      reply = `Namaskara! Here is the confirmed tariff for the 3 halls at Buntara Bhavana, Guruvayankere:
• **Malady Tunga & Mundappa Shetty Vedike (AC Hall)**: ₹75,000 (Grand celebrations, 600–1,200+ guests)
• **Kaashi Shetty Vedike (Non-AC Hall)**: ₹35,000 (Naturally ventilated, 350–700 guests)
• **Arvaguthu K. Narayana Rai Vedike (Mini Hall)**: ₹12,000 (Engagements & naming ceremonies, 80–200 guests)

Each booking includes access to our dedicated dining hall and spacious parking. Would you like me to recommend a hall for your specific event?`;
    } else if (lower.includes('lift') || lower.includes('elderly') || lower.includes('accessibility') || lower.includes('stairs')) {
      reply = `Yes, absolutely! Buntara Bhavana is fully equipped with a modern passenger lift facility. It allows senior citizens, elderly relatives, and guests with mobility difficulties to easily access both the main function hall and the separate dining hall without needing to climb stairs.`;
    } else if (lower.includes('dining') || lower.includes('food') || lower.includes('catering') || lower.includes('veg')) {
      reply = `Buntara Bhavana features a spacious, separate dining hall designed specifically for traditional Tulunadu vegetarian banana leaf feasts (Oota / Sadya). Pure vegetarian catering is customary. The dining hall connects smoothly with the main halls and lift facility.`;
    } else if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('reach')) {
      reply = `Buntara Bhavana is centrally located in **Guruvayankere, Belthangady Taluk, Dakshina Kannada District, Karnataka**.
• Approx. 4 km from Belthangady Town
• Approx. 20 km from Sri Kshetra Dharmasthala
• Ample vehicle parking is available on-premise for all your guests!`;
    } else if (lower.includes('timing') || lower.includes('session') || lower.includes('hours')) {
      reply = `We host events across two primary sessions:
• **Morning Session**: typically 10:00 AM – 2:30 PM (or 8:00 AM – 3:00 PM for Mini Hall)
• **Evening Session**: typically 6:00 PM – 10:00 PM (or 10:30 PM for Mini Hall)
Full day bookings are also available for elaborate traditional weddings.`;
    } else {
      reply = `Namaskara! Welcome to Buntara Bhavana, Guruvayankere. I can help you choose the ideal hall, calculate an estimated budget, plan your auspicious Muhurtham itinerary, or answer questions about our facilities (AC & Non-AC halls, dining hall, lift for senior citizens, and parking).

💡 *Tip: You can add your Google Gemini API key via the settings button at any time to enable real-time generative reasoning!* How may I assist your celebration today?`;
    }

    return {
      replyText: reply,
      interactionId: 'local-demo-' + Date.now()
    };
  }

  try {
    const interaction = await client.interactions.create({
      model: GEMINI_MODEL_DEFAULT,
      system_instruction: VENUE_CONTEXT,
      input: userMessage,
      previous_interaction_id: previousInteractionId
    });

    return {
      replyText: interaction.output_text || 'Thank you for contacting Buntara Bhavana. How else can I assist your celebration?',
      interactionId: interaction.id
    };
  } catch (err) {
    console.warn(`Interactions API with ${GEMINI_MODEL_DEFAULT} failed, trying ${GEMINI_MODEL_FAST}:`, err);
    try {
      const fallbackInteraction = await client.interactions.create({
        model: GEMINI_MODEL_FAST,
        system_instruction: VENUE_CONTEXT,
        input: userMessage,
        previous_interaction_id: previousInteractionId
      });
      return {
        replyText: fallbackInteraction.output_text || 'Thank you for reaching out to Buntara Bhavana.',
        interactionId: fallbackInteraction.id
      };
    } catch (fallbackErr) {
      console.error('Gemini chat error:', fallbackErr);
      return {
        replyText: 'I encountered a brief connection issue contacting the Gemini service. Please check your internet connection or API key. In the meantime, feel free to explore our confirmed halls and rates!',
        interactionId: previousInteractionId || 'err-' + Date.now()
      };
    }
  }
};
