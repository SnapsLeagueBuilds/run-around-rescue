import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client (replaces Base44 client)
export const base44 = createClient(supabaseUrl, supabaseKey);