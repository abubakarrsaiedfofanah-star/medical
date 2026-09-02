import {createClient, type SupabaseClient} from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const isProductionUrl = typeof url === 'string' && /^https:\/\//i.test(url);
const looksPrivileged = typeof anonKey === 'string' && (anonKey.includes('service_role') || anonKey.startsWith('sb_secret_'));
const validConfiguration = Boolean(url && anonKey && !looksPrivileged && (!import.meta.env.PROD || isProductionUrl));

export const supabase: SupabaseClient | null = validConfiguration ? createClient(url as string, anonKey as string, {
  auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true},
}) : null;
