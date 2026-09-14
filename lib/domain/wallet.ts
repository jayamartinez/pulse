import type { Chain } from "@/lib/domain/chain";

export type Wallet = {
  id: string;
  chain: Chain;
  address: string;
  name: string | null;
  emoji?: string;
  alertsOnToast: boolean;
  alertsOnBubble: boolean;
  alertsOnFeed: boolean;
  sound: string;
  highlightColor: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WalletLabel = {
  id: string;
  name: string;
  createdAt: Date;
};

export type WalletList = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
