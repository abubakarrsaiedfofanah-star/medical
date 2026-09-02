export type ReferenceType = 'PAT'|'ENC'|'APT'|'RX'|'PHO'|'PAY'|'RCP'|'LAB'|'HMV'|'TKT'|'ORG';
export function saiedId(type: ReferenceType, n = Date.now()) {
  return `SAIED-${type}-${String(n).padStart(10,'0')}`;
}
