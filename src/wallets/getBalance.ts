/**
 * Get USDC balance for a wallet.
 * 
 * Matches Python SDK: get_balance(wallet_id)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { ValidationError } from "../errors/OmniAgentError";

export async function getBalance(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
  }
): Promise<string> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  const response = await client.request<{ balance: string }>(
    "GET",
    `/wallets/${params.walletId}/balance`
  );

  return response.balance;
}
