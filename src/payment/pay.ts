/**
 * Execute a payment with automatic routing.
 * 
 * Matches Python SDK: pay(wallet_id, recipient, amount, ...)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { PaymentResult, Network, FeeLevel } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function pay(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    destinationChain?: Network | string;
    walletSetId?: string;
    purpose?: string;
    idempotencyKey?: string;
    feeLevel?: FeeLevel;
    skipGuards?: boolean;
    metadata?: Record<string, any>;
    waitForCompletion?: boolean;
    timeoutSeconds?: number;
  }
): Promise<PaymentResult> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  if (!params.recipient) {
    throw new ValidationError("recipient is required");
  }

  if (!params.amount || parseFloat(String(params.amount)) <= 0) {
    throw new ValidationError("Payment amount must be positive");
  }

  const response = await client.request<PaymentResult>("POST", "/payments/pay", {
    wallet_id: params.walletId,
    recipient: params.recipient,
    amount: String(params.amount),
    destination_chain: params.destinationChain,
    wallet_set_id: params.walletSetId,
    purpose: params.purpose,
    idempotency_key: params.idempotencyKey,
    fee_level: params.feeLevel,
    skip_guards: params.skipGuards || false,
    metadata: params.metadata,
    wait_for_completion: params.waitForCompletion || false,
    timeout_seconds: params.timeoutSeconds,
  });

  return response;
}
