import "server-only";

import { asc, desc } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { labels, walletEvents, walletLabels, walletListMembers, walletLists, wallets } from "@/lib/db/schema";
import type { Wallet } from "@/lib/domain/wallet";
import type { TransferEvent, WalletEvent } from "@/lib/domain/wallet-event";

export type CreateWalletInput = Omit<Wallet, "id" | "createdAt" | "updatedAt"> & { labels: string[]; lists: string[] };

export class PostgresWalletRepository {
  async listWallets(): Promise<Wallet[]> {
    return getDatabase().select().from(wallets).orderBy(asc(wallets.createdAt));
  }

  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    const db = getDatabase();
    const id = crypto.randomUUID();
    const { labels: labelNames, lists: listNames, ...walletInput } = input;
    const [wallet] = await db.insert(wallets).values({ ...walletInput, id }).onConflictDoUpdate({
      target: [wallets.chain, wallets.address],
      set: { name: input.name, emoji: input.emoji, alertsOnToast: input.alertsOnToast, alertsOnBubble: input.alertsOnBubble, alertsOnFeed: input.alertsOnFeed, sound: input.sound, highlightColor: input.highlightColor, updatedAt: new Date() },
    }).returning();
    await this.attachMetadata(wallet.id, labelNames, listNames);
    return wallet;
  }

  async importWallets(inputs: CreateWalletInput[]) { return Promise.all(inputs.map(input => this.createWallet(input))); }

  async listEvents(limit = 200): Promise<WalletEvent[]> {
    const rows = await getDatabase().select().from(walletEvents).orderBy(desc(walletEvents.detectedAt)).limit(limit);
    return rows.map(rowToEvent);
  }

  async insertEvents(events: WalletEvent[]): Promise<WalletEvent[]> {
    const db = getDatabase();
    const inserted: WalletEvent[] = [];
    for (const event of events) {
      const row = eventToRow(event);
      const result = await db.insert(walletEvents).values(row).onConflictDoNothing({ target: walletEvents.eventIdentity }).returning();
      if (result[0]) inserted.push(rowToEvent(result[0]));
    }
    return inserted;
  }

  private async attachMetadata(walletId: string, labelNames: string[], listNames: string[]) {
    const db = getDatabase();
    for (const name of unique(labelNames)) {
      const [label] = await db.insert(labels).values({ id: crypto.randomUUID(), name }).onConflictDoUpdate({ target: labels.name, set: { name } }).returning();
      await db.insert(walletLabels).values({ walletId, labelId: label.id }).onConflictDoNothing();
    }
    for (const name of unique(listNames)) {
      const [list] = await db.insert(walletLists).values({ id: crypto.randomUUID(), name }).onConflictDoUpdate({ target: walletLists.name, set: { name, updatedAt: new Date() } }).returning();
      await db.insert(walletListMembers).values({ walletId, walletListId: list.id }).onConflictDoNothing();
    }
  }
}

function eventToRow(event: WalletEvent) {
  const transfer = event.kind === "transfer";
  return { id: event.id, eventIdentity: event.id, chain: event.chain, walletId: transfer ? event.fromWalletId ?? event.toWalletId : event.walletId, walletAddress: transfer ? event.fromAddress : event.walletAddress, type: transfer ? "transfer" as const : event.side, tokenAddress: event.tokenAddress, tokenSymbol: event.tokenSymbol, tokenAmount: event.tokenAmount, nativeAmount: event.nativeAmount, nativeSymbol: event.nativeSymbol, usdValue: event.usdValue, marketCapUsd: event.marketCapUsd, fromAddress: transfer ? event.fromAddress : null, toAddress: transfer ? event.toAddress : null, transactionHash: event.transactionHash, blockTimestamp: event.blockTimestamp, detectedAt: event.detectedAt, source: event.source, providerMetadata: event.providerMetadata };
}

function rowToEvent(row: typeof walletEvents.$inferSelect): WalletEvent {
  const base = { id: row.eventIdentity, chain: row.chain, transactionHash: row.transactionHash, blockTimestamp: row.blockTimestamp, detectedAt: row.detectedAt, source: row.source ?? undefined, providerMetadata: row.providerMetadata ?? undefined, tokenAddress: row.tokenAddress ?? undefined, tokenSymbol: row.tokenSymbol ?? "Unknown", tokenAmount: row.tokenAmount ?? "0", nativeAmount: row.nativeAmount ?? undefined, nativeSymbol: row.nativeSymbol ?? undefined, usdValue: row.usdValue ?? undefined, marketCapUsd: row.marketCapUsd ?? undefined };
  if (row.type === "transfer") return { ...base, kind: "transfer", fromAddress: row.fromAddress ?? row.walletAddress, toAddress: row.toAddress ?? row.walletAddress, fromWalletId: row.walletId ?? undefined } as TransferEvent;
  return { ...base, kind: "trade", walletId: row.walletId ?? undefined, walletAddress: row.walletAddress, side: row.type === "sell" ? "sell" : "buy" };
}

function unique(values: string[]) { return [...new Set(values.map(value => value.trim()).filter(Boolean))]; }
