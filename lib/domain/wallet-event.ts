import type { Chain } from "@/lib/domain/chain";

export const walletEventTypes = ["buy", "sell", "swap", "transfer"] as const;

export type WalletEventType = (typeof walletEventTypes)[number];

export type WalletEvent = {
  id: string;
  chain: Chain;
  walletId?: string;
  walletAddress: string;
  type: WalletEventType;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenAmount?: string;
  usdValue?: string;
  transactionHash: string;
  blockTimestamp: Date;
  detectedAt: Date;
  source?: string;
  providerMetadata?: Record<string, unknown>;
};
