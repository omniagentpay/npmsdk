/**
 * Create a new wallet.
 * 
 * Matches Python SDK: create_wallet(...)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { WalletInfo, Network, AccountType } from "../types";
import { ValidationError } from "../errors/OmniAgentError";

export async function createWallet(
  client: OmniAgentPayClient,
  params: {
    blockchain?: Network | string;
    walletSetId?: string;
    accountType?: AccountType;
    name?: string;
  }
): Promise<WalletInfo> {
  const response = await client.request<WalletInfo>("POST", "/wallets", {
    blockchain: params.blockchain,
    wallet_set_id: params.walletSetId,
    account_type: params.accountType,
    name: params.name,
  });

  return response;
}

/**
 * Create a new wallet set.
 * 
 * Matches Python SDK: create_wallet_set(name?)
 */

export async function createWalletSet(
  client: OmniAgentPayClient,
  params?: {
    name?: string;
  }
): Promise<{ id: string; name?: string; custodyType: string; createDate: string; updateDate: string }> {
  const response = await client.request<{
    id: string;
    name?: string;
    custodyType: string;
    createDate: string;
    updateDate: string;
  }>("POST", "/wallet-sets", {
    name: params?.name,
  });

  return response;
}

/**
 * Get details of a specific wallet.
 * 
 * Matches Python SDK: get_wallet(wallet_id)
 */

export async function getWallet(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
  }
): Promise<WalletInfo> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  const response = await client.request<WalletInfo>(
    "GET",
    `/wallets/${params.walletId}`
  );

  return response;
}

/**
 * List available wallet sets.
 * 
 * Matches Python SDK: list_wallet_sets()
 */

export async function listWalletSets(
  client: OmniAgentPayClient
): Promise<Array<{ id: string; name?: string; custodyType: string; createDate: string; updateDate: string }>> {
  const response = await client.request<Array<{
    id: string;
    name?: string;
    custodyType: string;
    createDate: string;
    updateDate: string;
  }>>("GET", "/wallet-sets");

  return response;
}
