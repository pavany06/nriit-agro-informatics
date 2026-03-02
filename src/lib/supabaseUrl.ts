// Use Netlify proxy in production to bypass Jio DNS blocks
export const SUPABASE_URL = import.meta.env.PROD
  ? '/supabase-api'
  : import.meta.env.VITE_SUPABASE_URL;
