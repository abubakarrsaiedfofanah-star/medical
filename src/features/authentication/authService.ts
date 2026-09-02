import {supabase} from '../../lib/supabase';

export type AuthUser = {name: string; email: string; role: string};

const SESSION_KEY = 'saied-demo-session';
const validRoles = new Set(['patient','doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory','admin']);

function normalizeRole(role: string) { return validRoles.has(role) ? role : 'patient'; }
function normalizeEmail(email: string) { return email.trim().toLowerCase(); }
function validatePassword(password: string) { if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) throw new Error('Password must be at least 8 characters and include a letter and a number.'); }

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof user.name !== 'string' || typeof user.email !== 'string' || typeof user.role !== 'string' || !validRoles.has(user.role)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return {name: user.name, email: user.email, role: user.role};
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function demoMode() { return !supabase; }

async function getSupabaseUser(): Promise<AuthUser | null> {
  if (!supabase) return readSession();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return null;
  const managedRole = user.app_metadata?.role;
  const role = typeof managedRole === 'string' && validRoles.has(managedRole) ? managedRole : 'patient';
  return {name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'SAIED User', email: user.email || '', role};
}

export const authService = {
  getUser: (): AuthUser | null => import.meta.env.DEV && demoMode() ? readSession() : null,
  getCurrentUser: getSupabaseUser,
  subscribe: (onUserChange: (user: AuthUser | null) => void) => {
    if (!supabase) return () => {};
    const {data: {subscription}} = supabase.auth.onAuthStateChange(() => {
      getSupabaseUser().then(onUserChange).catch(() => onUserChange(null));
    });
    return () => subscription.unsubscribe();
  },
  resetPassword: async (email: string) => {
    if (!supabase) throw new Error('Supabase authentication is required');
    const {error} = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {redirectTo: `${location.origin}/auth?mode=reset`});
    if (error) throw error;
  },
  updatePassword: async (password: string) => {
    if (!supabase) throw new Error('Supabase authentication is required');
    validatePassword(password);
    const {error} = await supabase.auth.updateUser({password});
    if (error) throw error;
  },
  enrollMfa: async () => {
    if (!supabase) throw new Error('Supabase authentication is required');
    const {data, error} = await supabase.auth.mfa.enroll({factorType: 'totp', friendlyName: 'SAIED authenticator'});
    if (error) throw error;
    return data;
  },
  signIn: async (email: string, password: string, role: string): Promise<AuthUser> => {
    email = normalizeEmail(email);
    validatePassword(password);
    role = normalizeRole(role);
    if (supabase) {
      const {error} = await supabase.auth.signInWithPassword({email, password});
      if (error) throw error;
      return (await getSupabaseUser()) as AuthUser;
    }
    if (!import.meta.env.DEV) throw new Error('Supabase authentication is required');
    const user = {name: email.split('@')[0] || 'SAIED User', email, role};
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  register: async (name: string, email: string, password: string, role: string): Promise<AuthUser> => {
    email = normalizeEmail(email);
    validatePassword(password);
    role = normalizeRole(role);
    if (supabase) {
      const {error} = await supabase.auth.signUp({email, password, options: {data: {full_name: name, role}}});
      if (error) throw error;
      return (await getSupabaseUser()) as AuthUser;
    }
    if (!import.meta.env.DEV) throw new Error('Supabase authentication is required');
    const user = {name: name.trim() || 'SAIED User', email, role};
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  signOut: async () => { localStorage.removeItem(SESSION_KEY); if (supabase) await supabase.auth.signOut(); },
};
