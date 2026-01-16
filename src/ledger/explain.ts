/**
 * Explain a transaction.
 * 
 * Provides human-readable explanation of what a transaction does.
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { ValidationError } from "../errors/OmniAgentError";

export async function explain(
  client: OmniAgentPayClient,
  params: {
    txId: string;
  }
): Promise<{
  explanation: string;
  details: Record<string, any>;
}> {
  if (!params.txId) {
    throw new ValidationError("txId is required");
  }

  const response = await client.request<{
    explanation: string;
    details: Record<string, any>;
  }>("GET", `/ledger/transactions/${params.txId}/explain`);

  return response;
}
