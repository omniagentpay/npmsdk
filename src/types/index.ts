/**
 * Type definitions for OmniAgentPay SDK.
 * 
 * This module contains all enums, interfaces, and type definitions
 * used throughout the SDK.
 */

export enum Network {
  ETH = "ETH",
  ETH_SEPOLIA = "ETH-SEPOLIA",
  AVAX = "AVAX",
  AVAX_FUJI = "AVAX-FUJI",
  MATIC = "MATIC",
  MATIC_AMOY = "MATIC-AMOY",
  SOL = "SOL",
  SOL_DEVNET = "SOL-DEVNET",
  ARB = "ARB",
  ARB_SEPOLIA = "ARB-SEPOLIA",
  BASE = "BASE",
  BASE_SEPOLIA = "BASE-SEPOLIA",
  OP = "OP",
  OP_SEPOLIA = "OP-SEPOLIA",
  NEAR = "NEAR",
  NEAR_TESTNET = "NEAR-TESTNET",
  APTOS = "APTOS",
  APTOS_TESTNET = "APTOS-TESTNET",
  UNI = "UNI",
  UNI_SEPOLIA = "UNI-SEPOLIA",
  MONAD = "MONAD",
  MONAD_TESTNET = "MONAD-TESTNET",
  ARC_TESTNET = "ARC-TESTNET",
  EVM = "EVM",
  EVM_TESTNET = "EVM-TESTNET",
}

export enum PaymentMethod {
  X402 = "x402",
  TRANSFER = "transfer",
  CROSSCHAIN = "crosschain",
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  BLOCKED = "blocked",
}

export enum PaymentIntentStatus {
  REQUIRES_CONFIRMATION = "requires_confirmation",
  PROCESSING = "processing",
  SUCCEEDED = "succeeded",
  CANCELED = "canceled",
  FAILED = "failed",
}

export enum WalletState {
  LIVE = "LIVE",
  FROZEN = "FROZEN",
}

export enum AccountType {
  SCA = "SCA",
  EOA = "EOA",
}

export enum CustodyType {
  DEVELOPER = "DEVELOPER",
  ENDUSER = "ENDUSER",
}

export enum FeeLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface TokenInfo {
  id: string;
  blockchain: string;
  symbol: string;
  name: string;
  decimals: number;
  isNative: boolean;
  tokenAddress?: string;
  standard?: string;
}

export interface Balance {
  amount: string;
  token: TokenInfo;
  currency: string;
}

export interface WalletSetInfo {
  id: string;
  name?: string;
  custodyType: CustodyType;
  createDate: string;
  updateDate: string;
}

export interface WalletInfo {
  id: string;
  address: string;
  blockchain: string;
  state: WalletState;
  walletSetId: string;
  custodyType: CustodyType;
  accountType: AccountType;
  name?: string;
  createDate?: string;
  updateDate?: string;
}

export interface TransactionInfo {
  id: string;
  state: string;
  blockchain?: string;
  txHash?: string;
  walletId?: string;
  sourceAddress?: string;
  destinationAddress?: string;
  tokenId?: string;
  amounts: string[];
  feeLevel?: FeeLevel;
  createDate?: string;
  updateDate?: string;
  errorReason?: string;
}

export interface PaymentIntent {
  id: string;
  walletId: string;
  recipient: string;
  amount: string;
  currency: string;
  status: PaymentIntentStatus;
  createdAt: string;
  expiresAt?: string;
  metadata: Record<string, any>;
  clientSecret?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  blockchainTx?: string;
  amount: string;
  recipient: string;
  method: PaymentMethod;
  status: PaymentStatus;
  guardsPassed: string[];
  error?: string;
  metadata: Record<string, any>;
}

export interface SimulationResult {
  wouldSucceed: boolean;
  route: PaymentMethod;
  guardsThatWouldPass: string[];
  guardsThatWouldFail: string[];
  estimatedFee?: string;
  reason?: string;
  intentId?: string;
}

export interface GuardResult {
  guardId: string;
  guardName: string;
  passed: boolean;
  reason?: string;
}

export interface GuardPolicy {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  walletId?: string;
  walletSetId?: string;
}

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
