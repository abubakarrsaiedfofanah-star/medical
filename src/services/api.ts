import { supabase } from '../lib/supabase';

export async function currentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

export async function createPatient(profileId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const patientId = `SAIED-PAT-${Date.now()}`;
  return supabase.from('patients').insert({ profile_id: profileId, saied_patient_id: patientId }).select().single();
}
