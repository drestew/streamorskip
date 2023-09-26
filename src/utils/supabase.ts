import { createClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabaseService = createClient<Database>(supabaseUrl, supabaseKey);
