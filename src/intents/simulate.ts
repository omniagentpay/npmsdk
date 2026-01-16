/**
 * Simulate a payment without executing.
 * 
 * Checks guards, routing, and estimates fees.
 * Matches Python SDK: simulate(wallet_id, recipient, amount, ...)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { SimulationResult, PaymentMethod } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function simulate(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    walletSetId?: string;
  }
): Promise<SimulationResult> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  if (!params.recipient) {
    throw new ValidationError("recipient is required");
  }

  if (!params.amount || parseFloat(String(params.amount)) <= 0) {
    throw new ValidationError("Amount must be a positive number");
  }

  const response = await client.request<{
    wouldSucceed: boolean;
    route: string;
    guardsThatWouldPass: string[];
    guardsThatWouldFail: string[];
    estimatedFee?: string;
    reason?: string;
  }>("POST", "/payments/simulate", {
    wallet_id: params.walletId,
    recipient: params.recipient,
    amount: String(params.amount),
    wallet_set_id: params.walletSetId,
  });

  return {
    wouldSucceed: response.wouldSucceed,
    route: response.route as PaymentMethod,
    guardsThatWouldPass: response.guardsThatWouldPass || [],
    guardsThatWouldFail: response.guardsThatWouldFail || [],
    estimatedFee: response.estimatedFee,
    reason: response.reason,
  };
}
