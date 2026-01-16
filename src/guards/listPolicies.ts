/**
 * List all guard names registered for a wallet.
 * 
 * Matches Python SDK: list_guards(wallet_id)
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { ValidationError } from "../errors/OmniAgentError";

export async function listPolicies(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
  }
): Promise<string[]> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  const response = await client.request<string[]>(
    "GET",
    `/guards?wallet_id=${params.walletId}`
  );
  return response;
}

/**
 * List all guard names registered for a wallet set.
 * 
 * Matches Python SDK: list_guards_for_set(wallet_set_id)
 */

export async function listGuardsForSet(
  client: OmniAgentPayClient,
  params: {
    walletSetId: string;
  }
): Promise<string[]> {
  if (!params.walletSetId) {
    throw new ValidationError("wallet_set_id is required");
  }

  const response = await client.request<string[]>(
    "GET",
    `/guards?wallet_set_id=${params.walletSetId}`
  );
  return response;
}
