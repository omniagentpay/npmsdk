/**
 * Confirm and execute a payment intent.
 * 
 * Matches Python SDK: confirm_payment_intent(intent_id)
 * This replaces the separate approve() + execute() methods.
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { PaymentResult } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function confirmPaymentIntent(
  client: OmniAgentPayClient,
  params: {
    intentId: string;
  }
): Promise<PaymentResult> {
  if (!params.intentId) {
    throw new ValidationError("intent_id is required");
  }

  const response = await client.request<PaymentResult>(
    "POST",
    `/intents/${params.intentId}/confirm`
  );

  return response;
}
