import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tltankihglovzfvveyif.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdGFua2loZ2xvdnpmdnZleWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMzk4MDEsImV4cCI6MjEwNDcxNTgwMX0.yrmziZFnKC95DBDhYdS20CslpWV4l-BtzkWSV4WG0so';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
