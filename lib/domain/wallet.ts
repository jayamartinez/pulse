import type { Chain } from "@/lib/domain/chain";

export type Wallet = {
  id: string;
  chain: Chain;
  address: string;
  name: string;
  emoji?: string;
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
