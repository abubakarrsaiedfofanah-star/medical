export type CallType = 'voice' | 'video';
export type MessageType = 'text' | 'voice' | 'file' | 'system';

export interface Conversation {
  id: string;
  patientId?: string;
  participantIds: string[];
  lastMessageAt?: string;
}

export interface CallSession {
  id: string;
  conversationId: string;
  type: CallType;
  status: 'ringing'|'connected'|'ended'|'missed';
  startedAt?: string;
  endedAt?: string;
}
