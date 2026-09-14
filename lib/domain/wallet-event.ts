import type { Chain } from "@/lib/domain/chain";

export type TradeSide = "buy" | "sell";
export type WalletEventSourceType = "buy" | "sell" | "swap" | "transfer";
type EventBase = { id: string; chain: Chain; transactionHash: string; blockTimestamp: Date; detectedAt: Date; source?: string; providerMetadata?: Record<string, unknown> };
export type TradeEvent = EventBase & { kind: "trade"; walletId?: string; walletAddress: string; side: TradeSide; tokenAddress?: string; tokenSymbol: string; tokenAmount: string; nativeAmount?: string; nativeSymbol?: string; usdValue?: string; marketCapUsd?: string };
export type TransferEvent = EventBase & { kind: "transfer"; fromAddress: string; toAddress: string; fromWalletId?: string; toWalletId?: string; tokenAddress?: string; tokenSymbol: string; tokenAmount: string; nativeAmount?: string; nativeSymbol?: string; usdValue?: string; marketCapUsd?: string };
export type WalletEvent = TradeEvent | TransferEvent;
export const walletEventTypes = ["buy", "sell", "swap", "transfer"] as const;

export function classifySwap(input: { walletSent: { symbol: string }; walletReceived: { symbol: string } }): TradeSide | null {
  if (input.walletSent.symbol === "SOL" && input.walletReceived.symbol !== "SOL") return "buy";
  if (input.walletReceived.symbol === "SOL" && input.walletSent.symbol !== "SOL") return "sell";
  return null;
}

export function resolveWalletIdentity(address: string, wallets: Array<{ address: string; name: string; emoji?: string }>) {
  const wallet = wallets.find(item => item.address.toLowerCase() === address.toLowerCase());
  return wallet ? `${wallet.emoji ?? ""}${wallet.emoji ? " " : ""}${wallet.name}` : `${address.slice(0, 5)}…${address.slice(-4)}`;
}

export function formatMarketCap(value?: string) {
  if (!value) return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 2).replace(/\.00$/, "")}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(amount >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return `$${amount.toFixed(0)}`;
}
