/**
 * OmniAgentPay - Node.js SDK
 * 
 * Backend-only SDK for OmniAgentPay, designed for enterprise backends
 * and agent-integrated systems.
 * 
 * Matches Python SDK API contract from omniagentpy package.
 */

export { OmniAgentPayClient } from "./client/OmniAgentPayClient";
export * from "./types";
export * from "./errors/OmniAgentError";

// Default export
export { OmniAgentPayClient as default } from "./client/OmniAgentPayClient";

// Re-export for convenience (matches Python SDK exports)
export { OmniAgentPayClient as OmniAgentPay } from "./client/OmniAgentPayClient";
