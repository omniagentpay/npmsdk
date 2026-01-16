/**
 * Check if a payment would pass guard checks.
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { ValidationError } from "../errors/OmniAgentError";

export async function check(
  client: OmniAgentPayClient,
  params: {
    amount: number | string;
    token?: string;
    recipient?: string;
    walletId?: string;
  }
): Promise<{
  allowed: boolean;
  guards: Array<{
    name: string;
    passed: boolean;
    reason?: string;
  }>;
}> {
  if (!params.amount || parseFloat(String(params.amount)) <= 0) {
    throw new ValidationError("Amount must be a positive number");
  }

  const response = await client.request<{
    allowed: boolean;
    guards: Array<{
      name: string;
      passed: boolean;
      reason?: string;
    }>;
  }>("POST", "/guards/check", {
    amount: String(params.amount),
    token: params.token || "USDC",
    recipient: params.recipient,
    walletId: params.walletId,
  });

  return response;
}
