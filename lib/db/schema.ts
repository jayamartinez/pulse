import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { chains } from "@/lib/domain/chain";
import { walletEventTypes } from "@/lib/domain/wallet-event";

export const chainEnum = pgEnum("chain", chains);
export const walletEventTypeEnum = pgEnum("wallet_event_type", walletEventTypes);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const wallets = pgTable(
  "wallets",
  {
    id: uuid("id").primaryKey(),
    chain: chainEnum("chain").notNull(),
    address: text("address").notNull(),
    name: text("name"),
    emoji: text("emoji"),
    alertsOnToast: boolean("alerts_on_toast").notNull().default(true),
    alertsOnBubble: boolean("alerts_on_bubble").notNull().default(true),
    alertsOnFeed: boolean("alerts_on_feed").notNull().default(true),
    sound: text("sound").notNull().default("default"),
    highlightColor: text("highlight_color"),
    ...timestamps,
  },
  (table) => [uniqueIndex("wallets_chain_address_unique").on(table.chain, table.address)],
);

export const labels = pgTable("labels", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamps.createdAt,
});

export const walletLabels = pgTable(
  "wallet_labels",
  {
    walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
    labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.walletId, table.labelId] })],
);

export const walletLists = pgTable("wallet_lists", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull().unique(),
  ...timestamps,
});

export const walletListMembers = pgTable(
  "wallet_list_members",
  {
    walletListId: uuid("wallet_list_id").notNull().references(() => walletLists.id, { onDelete: "cascade" }),
    walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.walletListId, table.walletId] })],
);

export const walletEvents = pgTable(
  "wallet_events",
  {
    id: uuid("id").primaryKey(),
    chain: chainEnum("chain").notNull(),
    walletId: uuid("wallet_id").references(() => wallets.id, { onDelete: "set null" }),
    walletAddress: text("wallet_address").notNull(),
    type: walletEventTypeEnum("type").notNull(),
    tokenAddress: text("token_address"),
    tokenSymbol: text("token_symbol"),
    tokenAmount: text("token_amount"),
    usdValue: text("usd_value"),
    transactionHash: text("transaction_hash").notNull(),
    blockTimestamp: timestamp("block_timestamp", { withTimezone: true }).notNull(),
    detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
    source: text("source"),
    providerMetadata: jsonb("provider_metadata").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("wallet_events_chain_transaction_wallet_unique").on(table.chain, table.transactionHash, table.walletAddress),
    index("wallet_events_wallet_detected_at_index").on(table.walletId, table.detectedAt),
    index("wallet_events_chain_block_timestamp_index").on(table.chain, table.blockTimestamp),
  ],
);

export const walletsRelations = relations(wallets, ({ many }) => ({
  labels: many(walletLabels),
  listMemberships: many(walletListMembers),
  events: many(walletEvents),
}));

export const labelsRelations = relations(labels, ({ many }) => ({
  wallets: many(walletLabels),
}));

export const walletListsRelations = relations(walletLists, ({ many }) => ({
  memberships: many(walletListMembers),
}));

export const walletLabelsRelations = relations(walletLabels, ({ one }) => ({
  wallet: one(wallets, { fields: [walletLabels.walletId], references: [wallets.id] }),
  label: one(labels, { fields: [walletLabels.labelId], references: [labels.id] }),
}));

export const walletListMembersRelations = relations(walletListMembers, ({ one }) => ({
  wallet: one(wallets, { fields: [walletListMembers.walletId], references: [wallets.id] }),
  list: one(walletLists, { fields: [walletListMembers.walletListId], references: [walletLists.id] }),
}));
