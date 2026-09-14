import type { Chain } from "@/lib/domain/chain";
import type { WalletEvent } from "@/lib/domain/wallet-event";

export type ProviderHealth = {
  chain: Chain;
  available: boolean;
  checkedAt: Date;
  detail?: string;
};

export type WalletHistoryRequest = {
  address: string;
  before?: string;
  limit?: number;
};

export type WalletActivitySubscription = {
  unsubscribe: () => Promise<void>;
};

export interface ChainProvider {
  readonly chain: Chain;
  validateConnection(): Promise<ProviderHealth>;
  fetchWalletHistory(request: WalletHistoryRequest): Promise<WalletEvent[]>;
  getTransaction(transactionHash: string): Promise<WalletEvent | null>;
  subscribeToWalletActivity(
    addresses: string[],
    onEvent: (event: WalletEvent) => Promise<void> | void,
  ): Promise<WalletActivitySubscription>;
}
