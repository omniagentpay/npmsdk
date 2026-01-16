/**
 * List wallets (optional filter by set).
 * 
 * Matches Python SDK: list_wallets(wallet_set_id?)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { WalletInfo } from "../types";

export async function listWallets(
  client: OmniAgentPayClient,
  params?: {
    walletSetId?: string;
  }
): Promise<WalletInfo[]> {
  const queryParams = params?.walletSetId
    ? `?wallet_set_id=${params.walletSetId}`
    : "";
  const response = await client.request<WalletInfo[]>(
    "GET",
    `/wallets${queryParams}`
  );
  return response;
}
