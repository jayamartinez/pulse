DROP INDEX "wallet_events_chain_transaction_wallet_unique";--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "event_identity" text;--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "native_amount" text;--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "native_symbol" text;--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "market_cap_usd" text;--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "from_address" text;--> statement-breakpoint
ALTER TABLE "wallet_events" ADD COLUMN "to_address" text;--> statement-breakpoint
UPDATE "wallet_events" SET "event_identity" = "chain"::text || ':' || "transaction_hash" || ':' || "wallet_address" WHERE "event_identity" IS NULL;--> statement-breakpoint
ALTER TABLE "wallet_events" ALTER COLUMN "event_identity" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_events_event_identity_unique" ON "wallet_events" USING btree ("event_identity");
