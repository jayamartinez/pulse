CREATE TYPE "public"."chain" AS ENUM('solana', 'hood');--> statement-breakpoint
CREATE TYPE "public"."wallet_event_type" AS ENUM('buy', 'sell', 'swap', 'transfer');--> statement-breakpoint
CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "wallet_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chain" "chain" NOT NULL,
	"wallet_id" uuid,
	"wallet_address" text NOT NULL,
	"type" "wallet_event_type" NOT NULL,
	"token_address" text,
	"token_symbol" text,
	"token_amount" text,
	"usd_value" text,
	"transaction_hash" text NOT NULL,
	"block_timestamp" timestamp with time zone NOT NULL,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source" text,
	"provider_metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "wallet_labels" (
	"wallet_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_labels_wallet_id_label_id_pk" PRIMARY KEY("wallet_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "wallet_list_members" (
	"wallet_list_id" uuid NOT NULL,
	"wallet_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_list_members_wallet_list_id_wallet_id_pk" PRIMARY KEY("wallet_list_id","wallet_id")
);
--> statement-breakpoint
CREATE TABLE "wallet_lists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_lists_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chain" "chain" NOT NULL,
	"address" text NOT NULL,
	"name" text NOT NULL,
	"emoji" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wallet_events" ADD CONSTRAINT "wallet_events_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_labels" ADD CONSTRAINT "wallet_labels_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_labels" ADD CONSTRAINT "wallet_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_list_members" ADD CONSTRAINT "wallet_list_members_wallet_list_id_wallet_lists_id_fk" FOREIGN KEY ("wallet_list_id") REFERENCES "public"."wallet_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_list_members" ADD CONSTRAINT "wallet_list_members_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_events_chain_transaction_wallet_unique" ON "wallet_events" USING btree ("chain","transaction_hash","wallet_address");--> statement-breakpoint
CREATE INDEX "wallet_events_wallet_detected_at_index" ON "wallet_events" USING btree ("wallet_id","detected_at");--> statement-breakpoint
CREATE INDEX "wallet_events_chain_block_timestamp_index" ON "wallet_events" USING btree ("chain","block_timestamp");--> statement-breakpoint
CREATE UNIQUE INDEX "wallets_chain_address_unique" ON "wallets" USING btree ("chain","address");