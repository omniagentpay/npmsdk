/**
 * Create a payment intent.
 * 
 * Matches Python SDK: create_payment_intent(wallet_id, recipient, amount, ...)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { PaymentIntent } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function createPaymentIntent(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    purpose?: string;
    idempotencyKey?: string;
  }
): Promise<PaymentIntent> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  if (!params.recipient) {
    throw new ValidationError("recipient is required");
  }

  if (!params.amount || parseFloat(String(params.amount)) <= 0) {
    throw new ValidationError("Amount must be a positive number");
  }

  const response = await client.request<PaymentIntent>("POST", "/intents", {
    wallet_id: params.walletId,
    recipient: params.recipient,
    amount: String(params.amount),
    purpose: params.purpose,
    idempotency_key: params.idempotencyKey,
  });

  return response;
}
