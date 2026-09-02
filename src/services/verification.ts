export function verifyOrganizationDocument(documentNumber: string) {
  // Replace with the official regulator/provider-verification integration for each country.
  return Boolean(documentNumber.trim());
}

export function createReceiptVerificationToken(): string {
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure random generator unavailable');
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
