import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabaseClient = createClient(supabaseUrl, anonKey);
export const supabaseService = createClient<Database>(supabaseUrl, supabaseKey);
