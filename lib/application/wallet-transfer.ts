import type { Wallet } from "@/lib/data";
import { walletTransferDefaults, type WalletTransferRecord } from "@/lib/wallet-transfer";

// This adapter keeps the v0.1 mock dashboard compatible with the transfer domain.
// Database-backed wallet reads can replace it without changing import/export rules or UI.
export function dashboardWalletsToTransferRecords(wallets: Wallet[]): WalletTransferRecord[] {
  return wallets.map(wallet => ({
    trackedWalletAddress: wallet.address,
    chain: wallet.chain === "Solana" ? "solana" : "hood",
    name: wallet.name,
    emoji: wallet.emoji ?? null,
    groups: wallet.list ? [wallet.list] : [],
    ...walletTransferDefaults,
  }));
}
