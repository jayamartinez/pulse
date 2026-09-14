ALTER TABLE "wallets" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "alerts_on_toast" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "alerts_on_bubble" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "alerts_on_feed" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "sound" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "highlight_color" text;