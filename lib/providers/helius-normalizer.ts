import { classifySwap, type TransferEvent, type WalletEvent } from "../domain/wallet-event.ts";

export type HeliusBalanceChange = { userAccount?: string; mint?: string; rawTokenAmount?: { tokenAmount?: string; decimals?: number }; tokenAmount?: number };
export type HeliusTransaction = { signature?: string; timestamp?: number; type?: string; source?: string; nativeTransfers?: Array<{ fromUserAccount?: string; toUserAccount?: string; amount?: number }>; tokenTransfers?: Array<{ fromUserAccount?: string; toUserAccount?: string; mint?: string; tokenAmount?: number }>; accountData?: Array<{ account?: string; nativeBalanceChange?: number; tokenBalanceChanges?: HeliusBalanceChange[] }> };

export function normalizeHeliusTransaction(transaction: HeliusTransaction, trackedAddress: string): WalletEvent[] {
  if (!transaction.signature || !transaction.timestamp) return [];
  const base = { chain: "solana" as const, transactionHash: transaction.signature, blockTimestamp: new Date(transaction.timestamp * 1000), detectedAt: new Date(), source: "helius", providerMetadata: { transactionType: transaction.type ?? "UNKNOWN", source: transaction.source ?? "UNKNOWN" } };
  const account = transaction.accountData?.find(item => item.account === trackedAddress);
  const changes = account?.tokenBalanceChanges ?? [];
  const nativeDelta = account?.nativeBalanceChange ?? 0;
  const sentNative = nativeDelta <= -10_000_000;
  const receivedNative = nativeDelta >= 10_000_000;
  const sentToken = changes.find(change => tokenAmount(change) < 0);
  const receivedToken = changes.find(change => tokenAmount(change) > 0);
  if (trackedAddress && (sentToken || receivedToken)) {
    const side = classifySwap({ walletSent: { symbol: sentNative ? "SOL" : "TOKEN" }, walletReceived: { symbol: receivedNative ? "SOL" : "TOKEN" } });
    const token = side === "buy" ? receivedToken : sentToken;
    if (side && token) return [{ ...base, id: `${transaction.signature}:trade:${trackedAddress}`, kind: "trade", walletAddress: trackedAddress, side, tokenAddress: token.mint, tokenSymbol: "Unknown", tokenAmount: Math.abs(tokenAmount(token)).toString(), nativeAmount: (Math.abs(nativeDelta) / 1_000_000_000).toString(), nativeSymbol: "SOL" }];
  }
  return [...(transaction.nativeTransfers ?? []).map((transfer, index): TransferEvent | null => transfer.fromUserAccount && transfer.toUserAccount ? ({ ...base, id: `${transaction.signature}:native:${index}`, kind: "transfer", fromAddress: transfer.fromUserAccount, toAddress: transfer.toUserAccount, tokenSymbol: "SOL", tokenAmount: (Number(transfer.amount ?? 0) / 1_000_000_000).toString(), nativeAmount: (Number(transfer.amount ?? 0) / 1_000_000_000).toString(), nativeSymbol: "SOL" }) : null), ...(transaction.tokenTransfers ?? []).map((transfer, index): TransferEvent | null => transfer.fromUserAccount && transfer.toUserAccount ? ({ ...base, id: `${transaction.signature}:token:${index}`, kind: "transfer", fromAddress: transfer.fromUserAccount, toAddress: transfer.toUserAccount, tokenAddress: transfer.mint, tokenSymbol: "Unknown", tokenAmount: String(transfer.tokenAmount ?? 0) }) : null)].filter((event): event is TransferEvent => event !== null);
}
function tokenAmount(change: HeliusBalanceChange) { const raw = change.rawTokenAmount; return raw ? Number(raw.tokenAmount ?? 0) / 10 ** Number(raw.decimals ?? 0) : Number(change.tokenAmount ?? 0); }
