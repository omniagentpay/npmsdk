/**
 * List transactions for a wallet or globally.
 * 
 * Matches Python SDK: list_transactions(wallet_id?, blockchain?)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { TransactionInfo, Network } from "../types";

export async function listTransactions(
  client: OmniAgentPayClient,
  params?: {
    walletId?: string;
    blockchain?: Network | string;
  }
): Promise<TransactionInfo[]> {
  const queryParams = new URLSearchParams();
  if (params?.walletId) {
    queryParams.append("wallet_id", params.walletId);
  }
  if (params?.blockchain) {
    queryParams.append("blockchain", String(params.blockchain));
  }

  const path = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await client.request<TransactionInfo[]>("GET", path);
  return response;
}
