# OmniAgentPay Node.js SDK

**OmniAgentPay** is a Stripe-grade SDK for agent-initiated payments, enabling AI systems to simulate, approve, and execute payments safely using enterprise guardrails. Built for enterprise backends and agent-integrated systems, OmniAgentPay provides a production-ready interface for autonomous payment operations without exposing private keys or requiring frontend execution.

**This Node.js SDK matches the Python SDK API contract** from the `omniagentpy` package, ensuring consistency across both implementations.

## Installation

```bash
npm install omniagentpay
```

**Requirements:**
- Node.js 18.0.0 or higher
- An OmniAgentPay API key ([Get one here](https://console.omniagentpay.xyz))

## Quick Start

Get your first payment working in under 5 minutes.

### 1. Set up your API key

```bash
export OMNIAGENTPAY_API_KEY=sk_live_...
```

Or in your `.env` file:

```
OMNIAGENTPAY_API_KEY=sk_live_...
```

### 2. Instantiate the client

```typescript
import { OmniAgentPayClient } from 'omniagentpay';

const client = new OmniAgentPayClient({
  apiKey: process.env.OMNIAGENTPAY_API_KEY,
  baseUrl: 'https://api.omniagentpay.xyz'
});
```

### 3. Create a wallet and make a payment

```typescript
// Create a wallet
const wallet = await client.createWallet({
  name: 'my-agent-wallet'
});

// Check balance
const balance = await client.getBalance({ walletId: wallet.id });
console.log(`Balance: ${balance} USDC`);

// Make a payment
const result = await client.pay({
  walletId: wallet.id,
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
  amount: '10.50'
});

if (result.success) {
  console.log(`Payment confirmed! TX: ${result.blockchainTx}`);
}
```

**Complete working example:**

```typescript
import { OmniAgentPayClient } from 'omniagentpay';

async function main() {
  const client = new OmniAgentPayClient({
    apiKey: process.env.OMNIAGENTPAY_API_KEY!,
    baseUrl: 'https://api.omniagentpay.xyz'
  });

  // Create wallet
  const wallet = await client.createWallet();

  // Add budget guard
  await client.addBudgetGuard({
    walletId: wallet.id,
    dailyLimit: '100.00'
  });

  // Simulate payment
  const sim = await client.simulate({
    walletId: wallet.id,
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
    amount: '50.00'
  });

  if (!sim.wouldSucceed) {
    console.error(`Blocked: ${sim.reason}`);
    return;
  }

  // Execute payment
  const result = await client.pay({
    walletId: wallet.id,
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
    amount: '50.00'
  });
  
  console.log(`Success: ${result.success}, TX: ${result.blockchainTx}`);
}

main().catch(console.error);
```

## Core Concepts

### Payment Intents

A **Payment Intent** represents a planned payment that has been authorized but not yet executed. The intent lifecycle follows an Authorize-Capture pattern:

1. **Create Intent**: `createPaymentIntent()` - Creates an intent and validates guards/routing
2. **Confirm Intent**: `confirmPaymentIntent()` - Executes the approved intent, sending funds on-chain

This separation allows for multi-agent coordination, human review workflows, and scheduled payments.

### Simulation vs Execution

**Simulation** (`simulate()`) is a dry-run that:
- Checks guard policies without committing
- Estimates fees and routing
- Validates recipient and amount
- Does NOT create an intent

**Execution** (`pay()`) performs the actual on-chain transaction:
- Sends funds through the selected payment method
- Returns blockchain transaction hash

Simulation is free and safe. Execution costs gas and moves real funds.

### Guardrails

**Guards** are programmable policies that enforce spending limits and restrictions. They operate at the wallet level and check every payment before execution:

- **Budget Guards**: Enforce daily, hourly, or lifetime spending limits
- **Rate Limit Guards**: Prevent transaction flooding
- **Recipient Guards**: Whitelist or blacklist specific addresses or domains
- **Single Transaction Guards**: Cap individual transaction amounts
- **Confirm Guards**: Require human approval for payments above threshold

Guards are checked atomically during simulation and execution, ensuring mathematical guarantees even under concurrent load.

### Custodied Wallets

All wallets managed by OmniAgentPay are **custodied** through Circle's infrastructure. This means:

- Private keys never leave Circle's secure custody
- The SDK never handles or stores private keys
- All signing operations happen server-side in Circle's infrastructure
- Wallets are accessible via API only

This architecture eliminates the risk of key exposure while maintaining full programmatic control.

### Why Frontend Never Executes

Payment execution requires:
1. Access to custodied wallet credentials (managed by backend)
2. Guard policy evaluation (requires backend state)
3. Transaction signing (happens in Circle's infrastructure)

Frontend code cannot and should not execute payments. Instead, frontends should:
- Call backend APIs that use this SDK
- Display simulation results and guard status
- Trigger approval workflows through backend endpoints

This separation ensures security and auditability.

## API Reference

### OmniAgentPayClient

Main client class for interacting with OmniAgentPay APIs. Matches Python SDK `OmniAgentPay` class.

#### Constructor

```typescript
new OmniAgentPayClient(config: {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
})
```

**Parameters:**
- `apiKey` (required): Your OmniAgentPay API key
- `baseUrl` (optional): API base URL, defaults to `https://api.omniagentpay.xyz`
- `timeout` (optional): Request timeout in milliseconds, defaults to 30000

### Payment Methods

#### `pay(params)`

Execute a payment with automatic routing. Matches Python SDK: `pay(wallet_id, recipient, amount, ...)`

```typescript
const result = await client.pay({
  walletId: 'wallet_abc',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
  amount: '100.00',
  destinationChain?: 'BASE',
  walletSetId?: 'set_123',
  purpose?: 'Payment for services',
  idempotencyKey?: 'unique-key',
  feeLevel?: 'MEDIUM',
  skipGuards?: false,
  metadata?: {},
  waitForCompletion?: false,
  timeoutSeconds?: 30
});
```

**Returns:** `PaymentResult`

#### `simulate(params)`

Simulate a payment without executing. Matches Python SDK: `simulate(wallet_id, recipient, amount, ...)`

```typescript
const result = await client.simulate({
  walletId: 'wallet_abc',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
  amount: '100.00',
  walletSetId?: 'set_123'
});
```

**Returns:** `SimulationResult`

### Payment Intent Methods

#### `createPaymentIntent(params)`

Create a payment intent. Matches Python SDK: `create_payment_intent(wallet_id, recipient, amount, ...)`

```typescript
const intent = await client.createPaymentIntent({
  walletId: 'wallet_abc',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0',
  amount: '100.00',
  purpose?: 'Payment for services',
  idempotencyKey?: 'unique-key'
});
```

**Returns:** `PaymentIntent`

#### `confirmPaymentIntent(params)`

Confirm and execute a payment intent. Matches Python SDK: `confirm_payment_intent(intent_id)`

```typescript
const result = await client.confirmPaymentIntent({
  intentId: 'intent_abc'
});
```

**Returns:** `PaymentResult`

#### `getPaymentIntent(params)`

Get a payment intent by ID. Matches Python SDK: `get_payment_intent(intent_id)`

```typescript
const intent = await client.getPaymentIntent({
  intentId: 'intent_abc'
});
```

**Returns:** `PaymentIntent | null`

#### `cancelPaymentIntent(params)`

Cancel a payment intent. Matches Python SDK: `cancel_payment_intent(intent_id)`

```typescript
const intent = await client.cancelPaymentIntent({
  intentId: 'intent_abc'
});
```

**Returns:** `PaymentIntent`

### Wallet Methods

#### `getBalance(params)`

Get USDC balance for a wallet. Matches Python SDK: `get_balance(wallet_id)`

```typescript
const balance = await client.getBalance({
  walletId: 'wallet_abc'
});
```

**Returns:** `string` (balance amount)

#### `listWallets(params?)`

List wallets (optional filter by set). Matches Python SDK: `list_wallets(wallet_set_id?)`

```typescript
const wallets = await client.listWallets({
  walletSetId?: 'set_123'
});
```

**Returns:** `WalletInfo[]`

#### `createWallet(params?)`

Create a new wallet. Matches Python SDK: `create_wallet(...)`

```typescript
const wallet = await client.createWallet({
  blockchain?: 'ETH',
  walletSetId?: 'set_123',
  accountType?: 'EOA',
  name?: 'my-wallet'
});
```

**Returns:** `WalletInfo`

#### `createWalletSet(params?)`

Create a new wallet set. Matches Python SDK: `create_wallet_set(name?)`

```typescript
const walletSet = await client.createWalletSet({
  name?: 'my-wallet-set'
});
```

**Returns:** `WalletSetInfo`

#### `getWallet(params)`

Get details of a specific wallet. Matches Python SDK: `get_wallet(wallet_id)`

```typescript
const wallet = await client.getWallet({
  walletId: 'wallet_abc'
});
```

**Returns:** `WalletInfo`

#### `listWalletSets()`

List available wallet sets. Matches Python SDK: `list_wallet_sets()`

```typescript
const walletSets = await client.listWalletSets();
```

**Returns:** `WalletSetInfo[]`

### Transaction Methods

#### `listTransactions(params?)`

List transactions for a wallet or globally. Matches Python SDK: `list_transactions(wallet_id?, blockchain?)`

```typescript
const transactions = await client.listTransactions({
  walletId?: 'wallet_abc',
  blockchain?: 'ETH'
});
```

**Returns:** `TransactionInfo[]`

#### `explainTransaction(params)`

Get human-readable explanation of a transaction.

```typescript
const explanation = await client.explainTransaction({
  txId: 'tx_123'
});
```

**Returns:** `{ explanation: string; details: Record<string, any> }`

### Guard Methods

#### `listGuards(params)`

List all guard names registered for a wallet. Matches Python SDK: `list_guards(wallet_id)`

```typescript
const guards = await client.listGuards({
  walletId: 'wallet_abc'
});
```

**Returns:** `string[]`

#### `listGuardsForSet(params)`

List all guard names registered for a wallet set. Matches Python SDK: `list_guards_for_set(wallet_set_id)`

```typescript
const guards = await client.listGuardsForSet({
  walletSetId: 'set_123'
});
```

**Returns:** `string[]`

#### `addBudgetGuard(params)`

Add a budget guard to a wallet. Matches Python SDK: `add_budget_guard(wallet_id, ...)`

```typescript
await client.addBudgetGuard({
  walletId: 'wallet_abc',
  dailyLimit?: '100.00',
  hourlyLimit?: '10.00',
  totalLimit?: '1000.00',
  name?: 'budget'
});
```

#### `addBudgetGuardForSet(params)`

Add a budget guard to a wallet set. Matches Python SDK: `add_budget_guard_for_set(wallet_set_id, ...)`

```typescript
await client.addBudgetGuardForSet({
  walletSetId: 'set_123',
  dailyLimit?: '100.00',
  hourlyLimit?: '10.00',
  totalLimit?: '1000.00',
  name?: 'budget'
});
```

#### `addSingleTxGuard(params)`

Add a single transaction limit guard. Matches Python SDK: `add_single_tx_guard(wallet_id, ...)`

```typescript
await client.addSingleTxGuard({
  walletId: 'wallet_abc',
  maxAmount: '100.00',
  minAmount?: '0.50',
  name?: 'single_tx'
});
```

#### `addRecipientGuard(params)`

Add a recipient access control guard. Matches Python SDK: `add_recipient_guard(wallet_id, ...)`

```typescript
await client.addRecipientGuard({
  walletId: 'wallet_abc',
  mode?: 'whitelist',
  addresses?: ['0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0'],
  patterns?: [],
  domains?: ['api.example.com'],
  name?: 'recipient'
});
```

#### `addRecipientGuardForSet(params)`

Add a recipient guard to a wallet set. Matches Python SDK: `add_recipient_guard_for_set(wallet_set_id, ...)`

```typescript
await client.addRecipientGuardForSet({
  walletSetId: 'set_123',
  mode?: 'whitelist',
  addresses?: ['0x742d35Cc6634C0532925a3b844Bc9e7595f5e4a0'],
  patterns?: [],
  domains?: ['api.example.com'],
  name?: 'recipient'
});
```

#### `addRateLimitGuard(params)`

Add a rate limit guard to a wallet. Matches Python SDK: `add_rate_limit_guard(wallet_id, ...)`

```typescript
await client.addRateLimitGuard({
  walletId: 'wallet_abc',
  maxPerMinute?: 5,
  maxPerHour?: 20,
  maxPerDay?: 100,
  name?: 'rate_limit'
});
```

#### `addRateLimitGuardForSet(params)`

Add a rate limit guard to a wallet set. Matches Python SDK: `add_rate_limit_guard_for_set(wallet_set_id, ...)`

```typescript
await client.addRateLimitGuardForSet({
  walletSetId: 'set_123',
  maxPerMinute?: 5,
  maxPerHour?: 20,
  maxPerDay?: 100,
  name?: 'rate_limit'
});
```

#### `addConfirmGuard(params)`

Add a confirmation guard to a wallet. Matches Python SDK: `add_confirm_guard(wallet_id, ...)`

```typescript
await client.addConfirmGuard({
  walletId: 'wallet_abc',
  threshold?: '500.00',
  alwaysConfirm?: false,
  name?: 'confirm'
});
```

#### `addConfirmGuardForSet(params)`

Add a confirmation guard to a wallet set. Matches Python SDK: `add_confirm_guard_for_set(wallet_set_id, ...)`

```typescript
await client.addConfirmGuardForSet({
  walletSetId: 'set_123',
  threshold?: '500.00',
  alwaysConfirm?: false,
  name?: 'confirm'
});
```

### Network Methods

#### `listNetworks()`

List supported blockchain networks.

```typescript
const networks = await client.listNetworks();
```

**Returns:** `Network[]`

## Security Model

### No Private Keys in SDK

The SDK never handles, stores, or transmits private keys. All wallet operations are performed through Circle's custodied infrastructure. Private keys remain in Circle's secure custody at all times.

### Backend-Only Execution

This SDK is designed exclusively for backend/server-side use. It should never be:
- Bundled in frontend applications
- Exposed to browser environments
- Used in client-side JavaScript

Payment execution requires backend API access and should be gated behind your own authentication and authorization layers.

### MCP Isolation

The SDK does not expose MCP (Model Context Protocol) internals. It communicates only with OmniAgentPay backend APIs, maintaining clear architectural boundaries between the SDK layer and agent execution layers.

### Auditability

All payment operations are logged and traceable:
- Every intent creation, approval, and execution is recorded
- Transaction history is available through `listTransactions()`
- Guard checks and failures are included in simulation results
- All operations include metadata for audit trails

### API Key Security

- Store API keys in environment variables, never in code
- Use different API keys for development and production
- Rotate keys regularly
- Never commit API keys to version control

### Error Handling

The SDK uses typed exceptions for error handling:

```typescript
import {
  OmniAgentPayError,
  ValidationError,
  PaymentError,
  GuardError,
  NetworkError
} from 'omniagentpay';

try {
  const result = await client.pay({
    walletId: 'wallet_abc',
    recipient: '0x...',
    amount: '100.00'
  });
} catch (error) {
  if (error instanceof GuardError) {
    console.error(`Blocked by ${error.guardName}: ${error.reason}`);
  } else if (error instanceof NetworkError) {
    console.error(`API error: ${error.message}`);
  } else if (error instanceof OmniAgentPayError) {
    console.error(`SDK error: ${error.message}`);
  }
}
```

## Python SDK Parity

This Node.js SDK is designed to match the Python SDK (`omniagentpy`) API contract:

- **Method names**: Converted from Python's snake_case to JavaScript camelCase
- **Parameters**: Same required/optional parameters
- **Return types**: Same data structures
- **Error handling**: Same exception hierarchy
- **Behavior**: Same business logic and guard checks

Example comparison:

**Python SDK:**
```python
result = await client.pay(
    wallet_id="wallet_abc",
    recipient="0x...",
    amount=Decimal("100.00")
)
```

**Node.js SDK:**
```typescript
const result = await client.pay({
  walletId: 'wallet_abc',
  recipient: '0x...',
  amount: '100.00'
});
```

## Status

**Current Status:** Production-ready in interface, with backend execution wired progressively.

The SDK provides a stable, production-grade API interface that matches the Python SDK contract. Backend execution is being wired incrementally, with full feature parity planned for the next release.

**What Works Now:**
- Complete TypeScript type definitions
- All API methods with proper error handling
- Payment operations (pay, simulate, intents)
- Wallet management
- Guard system
- Transaction ledger

**Roadmap:**
- Full backend API integration
- Webhook support
- Enhanced error recovery
- Performance optimizations

## License

MIT

## Support

For issues, questions, or contributions, please visit:
- GitHub: [https://github.com/omniagentpay/omniagentpay-node](https://github.com/omniagentpay/omniagentpay-node)
- Documentation: [https://docs.omniagentpay.xyz](https://docs.omniagentpay.xyz)
- Support: [support@omniagentpay.xyz](mailto:support@omniagentpay.xyz)
