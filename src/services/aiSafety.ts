export type TriageOutput = {
  urgency: 'emergency'|'urgent'|'routine'|'unknown';
  message: string;
};

export function safeHealthTriage(): TriageOutput {
  return {
    urgency: 'unknown',
    message: 'SAIED AI must not diagnose or prescribe. Connect the patient with an appropriately licensed healthcare professional.',
  };
}
