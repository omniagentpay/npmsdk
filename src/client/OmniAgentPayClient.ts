/**
 * OmniAgentPayClient - Main SDK entry point.
 * 
 * Matches Python SDK: OmniAgentPay class
 * Backend-only SDK for OmniAgentPay, designed for enterprise backends
 * and agent-integrated systems.
 */

import { ClientConfig } from "../types";
import { NetworkError, ConfigurationError } from "../errors/OmniAgentError";
import { simulate } from "../intents/simulate";
import { pay } from "../payment/pay";
import { createPaymentIntent } from "../intents/createPaymentIntent";
import { confirmPaymentIntent } from "../intents/approve";
import { getPaymentIntent, cancelPaymentIntent } from "../intents/execute";
import { getBalance } from "../wallets/getBalance";
import { createWallet, createWalletSet, getWallet, listWalletSets } from "../wallets/createWallet";
import { listWallets } from "../wallets/listWallets";
import { listTransactions } from "../ledger/listTransactions";
import { explain } from "../ledger/explain";
import { listPolicies, listGuardsForSet } from "../guards/listPolicies";
import { check } from "../guards/check";
import {
  addBudgetGuard,
  addBudgetGuardForSet,
  addSingleTxGuard,
  addRecipientGuard,
  addRecipientGuardForSet,
  addRateLimitGuard,
  addRateLimitGuardForSet,
  addConfirmGuard,
  addConfirmGuardForSet,
} from "../guards/addGuards";
import { list } from "../networks/list";
import {
  SimulationResult,
  PaymentIntent,
  PaymentResult,
  WalletInfo,
  TransactionInfo,
  GuardPolicy,
  Network,
  FeeLevel,
  AccountType,
} from "../types";

export class OmniAgentPayClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ClientConfig) {
    if (!config.apiKey) {
      throw new ConfigurationError("apiKey is required");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.omniagentpay.xyz";
    this.timeout = config.timeout || 30000;
  }

  /**
   * Simulate a payment without executing.
   * 
   * Matches Python SDK: simulate(wallet_id, recipient, amount, ...)
   */
  async simulate(params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    walletSetId?: string;
  }): Promise<SimulationResult> {
    return simulate(this, params);
  }

  /**
   * Execute a payment with automatic routing.
   * 
   * Matches Python SDK: pay(wallet_id, recipient, amount, ...)
   */
  async pay(params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    destinationChain?: Network | string;
    walletSetId?: string;
    purpose?: string;
    idempotencyKey?: string;
    feeLevel?: FeeLevel;
    skipGuards?: boolean;
    metadata?: Record<string, any>;
    waitForCompletion?: boolean;
    timeoutSeconds?: number;
  }): Promise<PaymentResult> {
    return pay(this, params);
  }

  /**
   * Create a payment intent.
   * 
   * Matches Python SDK: create_payment_intent(wallet_id, recipient, amount, ...)
   */
  async createPaymentIntent(params: {
    walletId: string;
    recipient: string;
    amount: number | string;
    purpose?: string;
    idempotencyKey?: string;
  }): Promise<PaymentIntent> {
    return createPaymentIntent(this, params);
  }

  /**
   * Confirm and execute a payment intent.
   * 
   * Matches Python SDK: confirm_payment_intent(intent_id)
   */
  async confirmPaymentIntent(params: {
    intentId: string;
  }): Promise<PaymentResult> {
    return confirmPaymentIntent(this, params);
  }

  /**
   * Get a payment intent by ID.
   * 
   * Matches Python SDK: get_payment_intent(intent_id)
   */
  async getPaymentIntent(params: {
    intentId: string;
  }): Promise<PaymentIntent | null> {
    return getPaymentIntent(this, params);
  }

  /**
   * Cancel a payment intent.
   * 
   * Matches Python SDK: cancel_payment_intent(intent_id)
   */
  async cancelPaymentIntent(params: {
    intentId: string;
  }): Promise<PaymentIntent> {
    return cancelPaymentIntent(this, params);
  }

  /**
   * Get USDC balance for a wallet.
   * 
   * Matches Python SDK: get_balance(wallet_id)
   */
  async getBalance(params: {
    walletId: string;
  }): Promise<string> {
    return getBalance(this, params);
  }

  /**
   * List wallets (optional filter by set).
   * 
   * Matches Python SDK: list_wallets(wallet_set_id?)
   */
  async listWallets(params?: {
    walletSetId?: string;
  }): Promise<WalletInfo[]> {
    return listWallets(this, params);
  }

  /**
   * Create a new wallet.
   * 
   * Matches Python SDK: create_wallet(...)
   */
  async createWallet(params?: {
    blockchain?: Network | string;
    walletSetId?: string;
    accountType?: AccountType;
    name?: string;
  }): Promise<WalletInfo> {
    return createWallet(this, params || {});
  }

  /**
   * Create a new wallet set.
   * 
   * Matches Python SDK: create_wallet_set(name?)
   */
  async createWalletSet(params?: {
    name?: string;
  }): Promise<{ id: string; name?: string; custodyType: string; createDate: string; updateDate: string }> {
    return createWalletSet(this, params);
  }

  /**
   * Get details of a specific wallet.
   * 
   * Matches Python SDK: get_wallet(wallet_id)
   */
  async getWallet(params: {
    walletId: string;
  }): Promise<WalletInfo> {
    return getWallet(this, params);
  }

  /**
   * List available wallet sets.
   * 
   * Matches Python SDK: list_wallet_sets()
   */
  async listWalletSets(): Promise<Array<{ id: string; name?: string; custodyType: string; createDate: string; updateDate: string }>> {
    return listWalletSets(this);
  }

  /**
   * List transactions for a wallet or globally.
   * 
   * Matches Python SDK: list_transactions(wallet_id?, blockchain?)
   */
  async listTransactions(params?: {
    walletId?: string;
    blockchain?: Network | string;
  }): Promise<TransactionInfo[]> {
    return listTransactions(this, params);
  }

  /**
   * Explain a transaction.
   * 
   * Provides human-readable explanation of what a transaction does.
   */
  async explainTransaction(params: {
    txId: string;
  }): Promise<{
    explanation: string;
    details: Record<string, any>;
  }> {
    return explain(this, params);
  }

  /**
   * List all guard names registered for a wallet.
   * 
   * Matches Python SDK: list_guards(wallet_id)
   */
  async listGuards(params: {
    walletId: string;
  }): Promise<string[]> {
    return listPolicies(this, params);
  }

  /**
   * List all guard names registered for a wallet set.
   * 
   * Matches Python SDK: list_guards_for_set(wallet_set_id)
   */
  async listGuardsForSet(params: {
    walletSetId: string;
  }): Promise<string[]> {
    return listGuardsForSet(this, params);
  }

  /**
   * Add a budget guard to a wallet.
   * 
   * Matches Python SDK: add_budget_guard(wallet_id, ...)
   */
  async addBudgetGuard(params: {
    walletId: string;
    dailyLimit?: string | number;
    hourlyLimit?: string | number;
    totalLimit?: string | number;
    name?: string;
  }): Promise<void> {
    return addBudgetGuard(this, params);
  }

  /**
   * Add a budget guard to a wallet set.
   * 
   * Matches Python SDK: add_budget_guard_for_set(wallet_set_id, ...)
   */
  async addBudgetGuardForSet(params: {
    walletSetId: string;
    dailyLimit?: string | number;
    hourlyLimit?: string | number;
    totalLimit?: string | number;
    name?: string;
  }): Promise<void> {
    return addBudgetGuardForSet(this, params);
  }

  /**
   * Add a single transaction limit guard.
   * 
   * Matches Python SDK: add_single_tx_guard(wallet_id, ...)
   */
  async addSingleTxGuard(params: {
    walletId: string;
    maxAmount: string | number;
    minAmount?: string | number;
    name?: string;
  }): Promise<void> {
    return addSingleTxGuard(this, params);
  }

  /**
   * Add a recipient access control guard.
   * 
   * Matches Python SDK: add_recipient_guard(wallet_id, ...)
   */
  async addRecipientGuard(params: {
    walletId: string;
    mode?: "whitelist" | "blacklist";
    addresses?: string[];
    patterns?: string[];
    domains?: string[];
    name?: string;
  }): Promise<void> {
    return addRecipientGuard(this, params);
  }

  /**
   * Add a recipient guard to a wallet set.
   * 
   * Matches Python SDK: add_recipient_guard_for_set(wallet_set_id, ...)
   */
  async addRecipientGuardForSet(params: {
    walletSetId: string;
    mode?: "whitelist" | "blacklist";
    addresses?: string[];
    patterns?: string[];
    domains?: string[];
    name?: string;
  }): Promise<void> {
    return addRecipientGuardForSet(this, params);
  }

  /**
   * Add a rate limit guard to a wallet.
   * 
   * Matches Python SDK: add_rate_limit_guard(wallet_id, ...)
   */
  async addRateLimitGuard(params: {
    walletId: string;
    maxPerMinute?: number;
    maxPerHour?: number;
    maxPerDay?: number;
    name?: string;
  }): Promise<void> {
    return addRateLimitGuard(this, params);
  }

  /**
   * Add a rate limit guard to a wallet set.
   * 
   * Matches Python SDK: add_rate_limit_guard_for_set(wallet_set_id, ...)
   */
  async addRateLimitGuardForSet(params: {
    walletSetId: string;
    maxPerMinute?: number;
    maxPerHour?: number;
    maxPerDay?: number;
    name?: string;
  }): Promise<void> {
    return addRateLimitGuardForSet(this, params);
  }

  /**
   * Add a confirmation guard to a wallet.
   * 
   * Matches Python SDK: add_confirm_guard(wallet_id, ...)
   */
  async addConfirmGuard(params: {
    walletId: string;
    threshold?: string | number;
    alwaysConfirm?: boolean;
    name?: string;
  }): Promise<void> {
    return addConfirmGuard(this, params);
  }

  /**
   * Add a confirmation guard to a wallet set.
   * 
   * Matches Python SDK: add_confirm_guard_for_set(wallet_set_id, ...)
   */
  async addConfirmGuardForSet(params: {
    walletSetId: string;
    threshold?: string | number;
    alwaysConfirm?: boolean;
    name?: string;
  }): Promise<void> {
    return addConfirmGuardForSet(this, params);
  }

  /**
   * Check if a payment would pass guard checks.
   */
  async checkGuard(params: {
    amount: number | string;
    token?: string;
    recipient?: string;
    walletId?: string;
  }): Promise<{
    allowed: boolean;
    guards: Array<{
      name: string;
      passed: boolean;
      reason?: string;
    }>;
  }> {
    return check(this, params);
  }

  /**
   * List supported networks.
   */
  async listNetworks(): Promise<Network[]> {
    return list(this);
  }

  /**
   * Internal method to make HTTP requests.
   * 
   * @internal
   */
  async request<T>(
    method: string,
    path: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const requestHeaders: Record<string, string> = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as Record<string, any>;
        throw new NetworkError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url,
          errorData
        );
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof NetworkError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new NetworkError(
          `Request timeout after ${this.timeout}ms`,
          undefined,
          url
        );
      }

      throw new NetworkError(
        error instanceof Error ? error.message : "Unknown network error",
        undefined,
        url
      );
    }
  }
}
