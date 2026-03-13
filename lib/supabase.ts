import { createBrowserClient } from '@supabase/ssr';

// Used in Client Components ('use client')
// Reads session from the browser
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);