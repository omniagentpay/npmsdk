/**
 * List supported networks.
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { Network } from "../types";

export async function list(
  client: OmniAgentPayClient
): Promise<Network[]> {
  const response = await client.request<Network[]>("GET", "/networks");
  return response;
}
