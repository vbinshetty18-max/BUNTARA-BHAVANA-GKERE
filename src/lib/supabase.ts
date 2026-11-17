import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const configuredKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  || ''
);

const isValidProjectUrl = (() => {
  try {
    const url = new URL(supabaseUrl);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:')
      && (url.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname))
      && !url.hostname.startsWith('your-project')
    );
  } catch {
    return false;
  }
})();

const isValidPublicKey = Boolean(
  configuredKey
  && !/^(your-|replace-|placeholder)/i.test(configuredKey)
);

export const isSupabaseConfigured = isValidProjectUrl && isValidPublicKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, configuredKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;
