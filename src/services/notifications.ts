export type NotificationChannel = 'in_app'|'email'|'sms'|'whatsapp';

export async function queueNotification(channel: NotificationChannel, recipient: string, message: string) {
  // Production: route through a verified provider after consent and opt-in checks.
  return { channel, recipient, message, status: 'queued' as const };
}
