export type PaymentRequest = {
  reference: string;
  amount: number;
  currency: string;
  phone?: string;
};

export async function createPayment(request: PaymentRequest) {
  // Production payment adapter: M-Pesa/card/bank/other licensed provider.
  return { ...request, status: 'pending' as const };
}
