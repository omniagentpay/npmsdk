/**
 * Get a payment intent by ID.
 * 
 * Matches Python SDK: get_payment_intent(intent_id)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { PaymentIntent } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function getPaymentIntent(
  client: OmniAgentPayClient,
  params: {
    intentId: string;
  }
): Promise<PaymentIntent | null> {
  if (!params.intentId) {
    throw new ValidationError("intent_id is required");
  }

  const response = await client.request<PaymentIntent | null>(
    "GET",
    `/intents/${params.intentId}`
  );

  return response;
}

/**
 * Cancel a payment intent.
 * 
 * Matches Python SDK: cancel_payment_intent(intent_id)
 */

export async function cancelPaymentIntent(
  client: OmniAgentPayClient,
  params: {
    intentId: string;
  }
): Promise<PaymentIntent> {
  if (!params.intentId) {
    throw new ValidationError("intent_id is required");
  }

  const response = await client.request<PaymentIntent>(
    "POST",
    `/intents/${params.intentId}/cancel`
  );

  return response;
}
