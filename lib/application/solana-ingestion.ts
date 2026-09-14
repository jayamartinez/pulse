import "server-only";

import { HeliusSolanaProvider } from "@/lib/providers/helius";
import { publishWalletEvent } from "@/lib/realtime/event-bus";
import { PostgresWalletRepository } from "@/lib/repositories/postgres-wallet-repository";

const repository = new PostgresWalletRepository();
const provider = new HeliusSolanaProvider();
const subscriptions = new Map<string, Awaited<ReturnType<typeof provider.subscribeToWalletActivity>>>();

export async function addSolanaWallet(input: Parameters<PostgresWalletRepository["createWallet"]>[0]) {
  const wallet = await repository.createWallet(input);
  await backfillWallet(wallet.id, wallet.address);
  await monitorWallet(wallet.id, wallet.address);
  return wallet;
}

export async function backfillWallet(walletId: string, address: string) {
  console.info(JSON.stringify({ event: "solana_backfill_started", walletId }));
  try {
    const events = (await provider.fetchWalletHistory({ address, limit: 100 })).map(event => event.kind === "trade" ? { ...event, walletId } : event);
    const persisted = await repository.insertEvents(events);
    persisted.forEach(publishWalletEvent);
    console.info(JSON.stringify({ event: "solana_backfill_completed", walletId, eventCount: persisted.length }));
  } catch (error) { console.warn(JSON.stringify({ event: "solana_backfill_failed", walletId, detail: error instanceof Error ? error.message : "unknown" })); }
}

export async function monitorWallet(walletId: string, address: string) {
  if (subscriptions.has(walletId)) return;
  const subscription = await provider.subscribeToWalletActivity([address], async event => {
    const persisted = await repository.insertEvents([event.kind === "trade" ? { ...event, walletId } : event]);
    persisted.forEach(publishWalletEvent);
  });
  subscriptions.set(walletId, subscription);
  console.info(JSON.stringify({ event: "solana_wallet_subscribed", walletId }));
}

export async function restoreSolanaMonitoring() {
  const wallets = await repository.listWallets();
  await Promise.all(wallets.filter(wallet => wallet.chain === "solana").map(wallet => monitorWallet(wallet.id, wallet.address)));
}

export async function getSolanaProviderHealth() { return provider.validateConnection(); }
export async function listPersistedEvents() { return repository.listEvents(); }
