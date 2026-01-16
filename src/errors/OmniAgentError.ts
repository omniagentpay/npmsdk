/**
 * Exception hierarchy for OmniAgentPay SDK.
 * 
 * All SDK-specific exceptions inherit from OmniAgentPayError for easy catching.
 */

export class OmniAgentPayError extends Error {
  public readonly details?: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = "OmniAgentPayError";
    this.details = details;
    Object.setPrototypeOf(this, OmniAgentPayError.prototype);
  }
}

export class ConfigurationError extends OmniAgentPayError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
    this.name = "ConfigurationError";
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class WalletError extends OmniAgentPayError {
  public readonly walletId?: string;

  constructor(message: string, walletId?: string, details?: Record<string, any>) {
    super(message, details);
    this.name = "WalletError";
    this.walletId = walletId;
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

export class PaymentError extends OmniAgentPayError {
  public readonly recipient?: string;
  public readonly amount?: string;

  constructor(
    message: string,
    recipient?: string,
    amount?: string,
    details?: Record<string, any>
  ) {
    super(message, details);
    this.name = "PaymentError";
    this.recipient = recipient;
    this.amount = amount;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

export class GuardError extends PaymentError {
  public readonly guardName: string;
  public readonly reason: string;

  constructor(
    message: string,
    guardName: string,
    reason: string,
    recipient?: string,
    amount?: string,
    details?: Record<string, any>
  ) {
    super(message, recipient, amount, details);
    this.name = "GuardError";
    this.guardName = guardName;
    this.reason = reason;
    Object.setPrototypeOf(this, GuardError.prototype);
  }

  toString(): string {
    return `[${this.guardName}] ${this.reason}`;
  }
}

export class ValidationError extends OmniAgentPayError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class InsufficientBalanceError extends PaymentError {
  public readonly currentBalance: string;
  public readonly requiredAmount: string;
  public readonly shortfall: string;

  constructor(
    message: string,
    currentBalance: string,
    requiredAmount: string,
    walletId?: string,
    details?: Record<string, any>
  ) {
    super(message, undefined, requiredAmount, details);
    this.name = "InsufficientBalanceError";
    this.currentBalance = currentBalance;
    this.requiredAmount = requiredAmount;
    this.shortfall = (
      parseFloat(requiredAmount) - parseFloat(currentBalance)
    ).toString();
    Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
  }

  toString(): string {
    return `${this.message} | Balance: ${this.currentBalance}, Required: ${this.requiredAmount}, Shortfall: ${this.shortfall}`;
  }
}

export class NetworkError extends OmniAgentPayError {
  public readonly statusCode?: number;
  public readonly url?: string;

  constructor(
    message: string,
    statusCode?: number,
    url?: string,
    details?: Record<string, any>
  ) {
    super(message, details);
    this.name = "NetworkError";
    this.statusCode = statusCode;
    this.url = url;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }

  isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500 && this.statusCode < 600;
  }
}
