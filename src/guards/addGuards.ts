/**
 * Guard helper methods.
 * 
 * Matches Python SDK guard methods.
 */

import { OmniAgentPayClient } from "../client/OmniAgentPayClient";
import { ValidationError } from "../errors/OmniAgentError";

/**
 * Add a budget guard to a wallet.
 * 
 * Matches Python SDK: add_budget_guard(wallet_id, ...)
 */
export async function addBudgetGuard(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    dailyLimit?: string | number;
    hourlyLimit?: string | number;
    totalLimit?: string | number;
    name?: string;
  }
): Promise<void> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  await client.request<void>("POST", `/guards/budget`, {
    wallet_id: params.walletId,
    daily_limit: params.dailyLimit ? String(params.dailyLimit) : undefined,
    hourly_limit: params.hourlyLimit ? String(params.hourlyLimit) : undefined,
    total_limit: params.totalLimit ? String(params.totalLimit) : undefined,
    name: params.name || "budget",
  });
}

/**
 * Add a budget guard to a wallet set.
 * 
 * Matches Python SDK: add_budget_guard_for_set(wallet_set_id, ...)
 */
export async function addBudgetGuardForSet(
  client: OmniAgentPayClient,
  params: {
    walletSetId: string;
    dailyLimit?: string | number;
    hourlyLimit?: string | number;
    totalLimit?: string | number;
    name?: string;
  }
): Promise<void> {
  if (!params.walletSetId) {
    throw new ValidationError("wallet_set_id is required");
  }

  await client.request<void>("POST", `/guards/budget/set`, {
    wallet_set_id: params.walletSetId,
    daily_limit: params.dailyLimit ? String(params.dailyLimit) : undefined,
    hourly_limit: params.hourlyLimit ? String(params.hourlyLimit) : undefined,
    total_limit: params.totalLimit ? String(params.totalLimit) : undefined,
    name: params.name || "budget",
  });
}

/**
 * Add a single transaction limit guard.
 * 
 * Matches Python SDK: add_single_tx_guard(wallet_id, ...)
 */
export async function addSingleTxGuard(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    maxAmount: string | number;
    minAmount?: string | number;
    name?: string;
  }
): Promise<void> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  await client.request<void>("POST", `/guards/single-tx`, {
    wallet_id: params.walletId,
    max_amount: String(params.maxAmount),
    min_amount: params.minAmount ? String(params.minAmount) : undefined,
    name: params.name || "single_tx",
  });
}

/**
 * Add a recipient access control guard.
 * 
 * Matches Python SDK: add_recipient_guard(wallet_id, ...)
 */
export async function addRecipientGuard(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    mode?: "whitelist" | "blacklist";
    addresses?: string[];
    patterns?: string[];
    domains?: string[];
    name?: string;
  }
): Promise<void> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  await client.request<void>("POST", `/guards/recipient`, {
    wallet_id: params.walletId,
    mode: params.mode || "whitelist",
    addresses: params.addresses,
    patterns: params.patterns,
    domains: params.domains,
    name: params.name || "recipient",
  });
}

/**
 * Add a recipient guard to a wallet set.
 * 
 * Matches Python SDK: add_recipient_guard_for_set(wallet_set_id, ...)
 */
export async function addRecipientGuardForSet(
  client: OmniAgentPayClient,
  params: {
    walletSetId: string;
    mode?: "whitelist" | "blacklist";
    addresses?: string[];
    patterns?: string[];
    domains?: string[];
    name?: string;
  }
): Promise<void> {
  if (!params.walletSetId) {
    throw new ValidationError("wallet_set_id is required");
  }

  await client.request<void>("POST", `/guards/recipient/set`, {
    wallet_set_id: params.walletSetId,
    mode: params.mode || "whitelist",
    addresses: params.addresses,
    patterns: params.patterns,
    domains: params.domains,
    name: params.name || "recipient",
  });
}

/**
 * Add a rate limit guard to a wallet.
 * 
 * Matches Python SDK: add_rate_limit_guard(wallet_id, ...)
 */
export async function addRateLimitGuard(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    maxPerMinute?: number;
    maxPerHour?: number;
    maxPerDay?: number;
    name?: string;
  }
): Promise<void> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  await client.request<void>("POST", `/guards/rate-limit`, {
    wallet_id: params.walletId,
    max_per_minute: params.maxPerMinute,
    max_per_hour: params.maxPerHour,
    max_per_day: params.maxPerDay,
    name: params.name || "rate_limit",
  });
}

/**
 * Add a rate limit guard to a wallet set.
 * 
 * Matches Python SDK: add_rate_limit_guard_for_set(wallet_set_id, ...)
 */
export async function addRateLimitGuardForSet(
  client: OmniAgentPayClient,
  params: {
    walletSetId: string;
    maxPerMinute?: number;
    maxPerHour?: number;
    maxPerDay?: number;
    name?: string;
  }
): Promise<void> {
  if (!params.walletSetId) {
    throw new ValidationError("wallet_set_id is required");
  }

  await client.request<void>("POST", `/guards/rate-limit/set`, {
    wallet_set_id: params.walletSetId,
    max_per_minute: params.maxPerMinute,
    max_per_hour: params.maxPerHour,
    max_per_day: params.maxPerDay,
    name: params.name || "rate_limit",
  });
}

/**
 * Add a confirmation guard to a wallet.
 * 
 * Matches Python SDK: add_confirm_guard(wallet_id, ...)
 */
export async function addConfirmGuard(
  client: OmniAgentPayClient,
  params: {
    walletId: string;
    threshold?: string | number;
    alwaysConfirm?: boolean;
    name?: string;
  }
): Promise<void> {
  if (!params.walletId) {
    throw new ValidationError("wallet_id is required");
  }

  await client.request<void>("POST", `/guards/confirm`, {
    wallet_id: params.walletId,
    threshold: params.threshold ? String(params.threshold) : undefined,
    always_confirm: params.alwaysConfirm || false,
    name: params.name || "confirm",
  });
}

/**
 * Add a confirmation guard to a wallet set.
 * 
 * Matches Python SDK: add_confirm_guard_for_set(wallet_set_id, ...)
 */
export async function addConfirmGuardForSet(
  client: OmniAgentPayClient,
  params: {
    walletSetId: string;
    threshold?: string | number;
    alwaysConfirm?: boolean;
    name?: string;
  }
): Promise<void> {
  if (!params.walletSetId) {
    throw new ValidationError("wallet_set_id is required");
  }

  await client.request<void>("POST", `/guards/confirm/set`, {
    wallet_set_id: params.walletSetId,
    threshold: params.threshold ? String(params.threshold) : undefined,
    always_confirm: params.alwaysConfirm || false,
    name: params.name || "confirm",
  });
}
