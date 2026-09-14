import type { WalletEvent } from "@/lib/domain/wallet-event";

type Listener = (event: WalletEvent) => void;
const listeners = new Set<Listener>();

export function publishWalletEvent(event: WalletEvent) {
  for (const listener of listeners) listener(event);
}

export function subscribeToWalletEvents(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
