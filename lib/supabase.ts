import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Клиентский Supabase клиент (для 'use client' компонентов).
 * Используется в app/page.tsx и других клиентских компонентах.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Синглтон для обратной совместимости
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
