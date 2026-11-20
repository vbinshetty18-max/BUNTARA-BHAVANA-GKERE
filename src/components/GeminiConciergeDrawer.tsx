import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Key,
  Calendar
} from 'lucide-react';
import {
  sendGeminiConciergeMessage
} from '../lib/gemini';

interface GeminiConciergeDrawerProps {
  onOpenPlanner: () => void;
  onOpenBooking: () => void;
  onOpenSettings: () => void;
}

interface ChatEntry {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Which hall is best for 500 guests?',
  'Is there a lift for senior citizens?',
  'What are the morning session timings?',
  'What is the rent of Malady Tunga AC hall?'
];

let messageCounter = 0;
const createMessageId = (prefix: string) => {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
};

export const GeminiConciergeDrawer: React.FC<GeminiConciergeDrawerProps> = ({
  onOpenPlanner,
  onOpenBooking,
  onOpenSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Namaskara! Welcome to Buntara Bhavana, Guruvayankere. I am your 24/7 Heritage Event Concierge powered by Google Gemini. How can I assist with your wedding, engagement, or cultural celebration today?',
      time: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatEntry = {
      id: createMessageId('usr'),
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await sendGeminiConciergeMessage(textToSend, previousInteractionId);
      setPreviousInteractionId(response.interactionId);

      const aiMessage: ChatEntry = {
        id: createMessageId('ai'),
        sender: 'ai',
        text: response.replyText,
        time: 'Just now'
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Concierge send error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId('err'),
          sender: 'ai',
          text: 'I apologize, but I could not reach the Gemini service at this moment. Please check your network or API key settings.',
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreviousInteractionId(undefined);
    setMessages([
      {
        id: createMessageId('reset'),
        sender: 'ai',
        text: 'Conversation reset. How can I assist you with hall bookings, pricing, or event arrangements at Buntara Bhavana?',
        time: 'Now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Concierge Action Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#741B1B] via-[#5A1015] to-[#741B1B] text-[#FFF0D5] font-bold text-xs uppercase tracking-wider rounded-full shadow-2xl border-2 border-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          style={{ fontFamily: "'Cinzel', serif" }}
          aria-label="Open Buntara AI Concierge"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#F3CF7A] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C99A43] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3CF7A]"></span>
            </span>
          </div>
          <span className="hidden sm:inline">Ask Buntara AI Concierge</span>
          <span className="sm:hidden">AI Concierge</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed right-3 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[94vw] sm:w-[410px] bg-white border-2 border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 text-gray-900 ${
            isMinimized ? 'h-14' : 'h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#5A1015] via-[#741B1B] to-[#5A1015] text-[#FFF0D5] border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C99A43]/30 border border-gray-200 flex items-center justify-center text-[#F3CF7A]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                  Buntara AI Concierge
                </h3>
                <span className="text-[10px] text-[#F3CF7A] font-medium block">
                  Online • Powered by Gemini
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#FFF0D5]/80">
              <button
                onClick={handleReset}
                className="p-1 hover:text-white rounded hover:bg-white/10"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenSettings}
                className="p-1 hover:text-white rounded hover:bg-white/10"
                title="API Key Settings"
              >
                <Key className="w-3.5 h-3.5 text-[#C99A43]" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white rounded hover:bg-white/10"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white rounded hover:bg-white/10"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Quick Actions Bar */}
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200/40 flex items-center justify-between gap-2 text-[11px]">
                <button
                  onClick={onOpenPlanner}
                  className="inline-flex items-center gap-1 font-semibold text-[#741B1B] hover:text-[#5A1015] hover:underline"
                >
                  <Sparkles className="w-3 h-3 text-[#C99A43]" /> Open Event & Budget Planner
                </button>
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-1 font-semibold text-[#741B1B] hover:text-[#5A1015] hover:underline"
                >
                  <Calendar className="w-3 h-3 text-[#C99A43]" /> Book Venue
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-white/60 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl shadow-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-[#741B1B] text-[#FFF0D5] rounded-br-none border border-gray-200/40'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-[#A64B2A]/70 px-1 mt-0.5">{msg.time}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 p-2.5 bg-white/70 rounded-xl border border-gray-200/30 w-fit">
                    <div className="w-3 h-3 border-2 border-[#741B1B] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px] text-[#741B1B] italic">Gemini is replying...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-3 py-2 bg-gray-50/70 border-t border-gray-200/30 overflow-x-auto flex gap-1.5 scrollbar-none">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-white hover:bg-white text-[#741B1B] rounded-full border border-gray-200 shadow-2xs font-medium cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about halls, pricing, dates, amenities..."
                  className="flex-1 px-3 py-2 text-xs bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C99A43] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
