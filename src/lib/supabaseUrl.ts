// Use Netlify proxy only when deployed on Netlify to bypass Jio DNS blocks
const isNetlify = typeof window !== 'undefined' && window.location.hostname.endsWith('.netlify.app');
export const SUPABASE_URL = isNetlify
  ? '/supabase-api'
  : import.meta.env.VITE_SUPABASE_URL;
