import React, { useState } from 'react';
import { Key, CheckCircle, AlertTriangle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { getGeminiApiKey, setStoredGeminiApiKey, getGeminiClient, GEMINI_MODEL_DEFAULT } from '../lib/gemini';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredGeminiApiKey(apiKey.trim());
    setTestStatus('idle');
    setTestMessage('API key preference saved successfully.');
    if (onKeySaved) onKeySaved();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredGeminiApiKey('');
    setTestStatus('idle');
    setTestMessage('API key cleared. System will use curated local venue intelligence.');
    if (onKeySaved) onKeySaved();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key to test.');
      return;
    }
    setTestStatus('testing');
    setTestMessage('Connecting to Google Gemini API...');

    try {
      const client = getGeminiClient(apiKey.trim());
      if (!client) {
        throw new Error('Could not initialize Google Gen AI client with provided key.');
      }
      const response = await client.interactions.create({
        model: GEMINI_MODEL_DEFAULT,
        input: 'Reply with the word "Verified" if you can read this.'
      });
      if (response && response.output_text) {
        setTestStatus('success');
        setTestMessage(`Connection verified successfully with ${GEMINI_MODEL_DEFAULT}!`);
      } else {
        throw new Error('No output text received.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(
        err?.message || 'Could not verify API key. Please ensure it is valid and has Gemini API permissions.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#741B1B] to-[#5A1015] text-[#FFF0D5] border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#C99A43]" />
            <h2 className="text-lg font-bold tracking-wider uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Gemini AI Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#FFF0D5]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-sm leading-relaxed text-gray-700">
            <p>
              Buntara Bhavana uses <strong>Google Gemini API</strong> (model{' '}
              <code className="px-1.5 py-0.5 bg-gray-100 text-[#741B1B] rounded text-xs font-mono font-semibold">
                {GEMINI_MODEL_DEFAULT}
              </code>
              ) to power the intelligent Muhurtham event planner, budget breakdown, and 24/7 venue concierge.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#741B1B]">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus('idle');
                }}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 pr-10 text-sm bg-white border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A43] focus:border-transparent font-mono"
              />
              <Key className="absolute right-3 top-3 w-4 h-4 text-[#C99A43]" />
            </div>
            <p className="text-[11px] text-[#741B1B]/80 flex items-center justify-between pt-1">
              <span>Saved locally in your browser.</span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#741B1B] font-semibold hover:underline"
              >
                Get API Key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testStatus === 'testing'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium'
                  : 'bg-rose-50 border border-rose-300 text-rose-900'
              }`}
            >
              {testStatus === 'testing' && (
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
              )}
              {testStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {testStatus === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Security & Fallback Assurance */}
          <div className="bg-gray-100/70 border border-gray-200/40 p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-gray-700">
            <ShieldCheck className="w-4 h-4 text-[#741B1B] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#741B1B]">No API key? No problem!</p>
              <p className="mt-0.5 text-[11px]">
                The site includes rich curated Tulunadu venue intelligence so you can preview event plans, budget breakdowns, and recommendations seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-t border-gray-200/40">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#741B1B] hover:text-[#5A1015] underline font-medium cursor-pointer"
          >
            Clear Stored Key
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing' || !apiKey.trim()}
              className="px-3 py-2 text-xs font-semibold rounded-md border border-gray-200 text-[#741B1B] hover:bg-white/60 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-md bg-[#741B1B] hover:bg-[#5A1015] text-[#FFF0D5] border border-gray-200 shadow-md transition-colors cursor-pointer"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
