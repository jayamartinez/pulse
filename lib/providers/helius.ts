import "server-only";

import type { WalletEvent } from "../domain/wallet-event.ts";
import { normalizeSolanaAddress } from "../domain/solana-address.ts";
import { resolveProviderCredential } from "./credentials.ts";
import type { ChainProvider, ProviderHealth, WalletActivitySubscription, WalletHistoryRequest } from "./types.ts";
import { normalizeHeliusTransaction, type HeliusTransaction } from "./helius-normalizer.ts";

const RPC_URL = "https://mainnet.helius-rpc.com";
const HISTORY_LIMIT = 100;

export class HeliusSolanaProvider implements ChainProvider {
  readonly chain = "solana" as const;

  async validateConnection(): Promise<ProviderHealth> {
    const checkedAt = new Date();
    const credential = await resolveProviderCredential("solana");
    if (!credential.apiKey) return { chain: "solana", available: false, checkedAt, detail: "HELIUS_API_KEY is not configured." };
    const startedAt = Date.now();
    try {
      await this.request("getHealth", []);
      return { chain: "solana", available: true, checkedAt, detail: `healthy (${Date.now() - startedAt}ms)` };
    } catch (error) {
      return { chain: "solana", available: false, checkedAt, detail: error instanceof Error ? error.message : "Helius health check failed." };
    }
  }

  async fetchWalletHistory({ address, limit = HISTORY_LIMIT }: WalletHistoryRequest): Promise<WalletEvent[]> {
    const walletAddress = normalizeSolanaAddress(address);
    // Helius's enhanced address endpoint supplies parsed transfers and account deltas; limit is capped for predictable v0.1 backfills.
    const response = await this.fetchJson<HeliusTransaction[]>(`/v0/addresses/${walletAddress}/transactions?token-accounts=balanceChanged`, { limit: Math.min(limit, HISTORY_LIMIT) });
    return response.flatMap(transaction => normalizeHeliusTransaction(transaction, walletAddress));
  }

  async getTransaction(transactionHash: string): Promise<WalletEvent | null> {
    const response = await this.fetchJson<HeliusTransaction[]>("/v0/transactions", {}, { transactions: [transactionHash] });
    return response.flatMap(transaction => normalizeHeliusTransaction(transaction, ""))[0] ?? null;
  }

  async subscribeToWalletActivity(addresses: string[], onEvent: (event: WalletEvent) => Promise<void> | void): Promise<WalletActivitySubscription> {
    // Node's built-in WebSocket is sufficient here; signatures are parsed through the authenticated REST endpoint.
    const credential = await resolveProviderCredential("solana");
    if (!credential.apiKey) throw new Error("HELIUS_API_KEY is not configured.");
    const activeAddresses = [...new Set(addresses.map(normalizeSolanaAddress))];
    const socket = new WebSocket(`wss://mainnet.helius-rpc.com/?api-key=${encodeURIComponent(credential.apiKey)}`);
    let requestId = 1;
    socket.addEventListener("open", () => socket.send(JSON.stringify({ jsonrpc: "2.0", id: requestId++, method: "transactionSubscribe", params: [{ accountInclude: activeAddresses, failed: false, vote: false }, { commitment: "confirmed", encoding: "jsonParsed", transactionDetails: "signatures" }] })));
    socket.addEventListener("message", async message => {
      try {
        const payload = JSON.parse(String(message.data)) as { method?: string; params?: { result?: { signature?: string } } };
        const signature = payload.method === "transactionNotification" ? payload.params?.result?.signature : undefined;
        if (!signature) return;
        const transaction = await this.getTransaction(signature);
        if (transaction) await onEvent(transaction);
      } catch (error) { console.warn(JSON.stringify({ event: "helius_realtime_event_failed", detail: error instanceof Error ? error.message : "unknown" })); }
    });
    socket.addEventListener("error", () => console.warn(JSON.stringify({ event: "helius_websocket_error" })));
    return { unsubscribe: async () => { if (socket.readyState !== WebSocket.CLOSED) socket.close(); } };
  }

  private async request(method: string, params: unknown[]) {
    const result = await this.rpc<{ result?: unknown; error?: { message?: string } }>(method, params);
    if (result.error) throw new Error(result.error.message ?? "Helius RPC request failed.");
    return result.result;
  }

  private async fetchJson<T>(path: string, query: Record<string, string | number>, body?: unknown): Promise<T> {
    const credential = await resolveProviderCredential("solana");
    if (!credential.apiKey) throw new Error("HELIUS_API_KEY is not configured.");
    const url = new URL(`${RPC_URL}${path}`); url.searchParams.set("api-key", credential.apiKey); for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
    const response = await retryFetch(url, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : undefined);
    return response.json() as Promise<T>;
  }

  private async rpc<T>(method: string, params: unknown[]): Promise<T> {
    const credential = await resolveProviderCredential("solana");
    if (!credential.apiKey) throw new Error("HELIUS_API_KEY is not configured.");
    const response = await retryFetch(`${RPC_URL}/?api-key=${encodeURIComponent(credential.apiKey)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
    return response.json() as Promise<T>;
  }
}

async function retryFetch(input: RequestInfo | URL, init?: RequestInit) { for (let attempt = 0; attempt < 5; attempt += 1) { const response = await fetch(input, init); if (response.ok) return response; if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 4) throw new Error(`Helius request failed (${response.status}).`); await new Promise(resolve => setTimeout(resolve, Math.min(30_000, 1_000 * 2 ** attempt))); } throw new Error("Helius request failed."); }
