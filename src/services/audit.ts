import { supabase } from '../lib/supabase';

export async function writeAuditLog(action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
  if (!supabase) return;
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return;
  const {error} = await supabase.from('audit_logs').insert({ actor_id: user.id, action, entity_type: entityType, entity_id: entityId, metadata });
  if (error) console.error('Audit log write failed', error.message);
}
