# Pulse architecture

Pulse is a self-hostable wallet-intelligence application. Version 0.1 now ingests real Solana activity through Helius; HOOD remains planned.

## Implemented

- PostgreSQL-backed Solana wallet persistence, including names, emoji, labels, lists, and alert preferences.
- Helius Solana provider with server-side `HELIUS_API_KEY` resolution, health checks, bounded history fetches, and retry handling.
- A 100-transaction Solana backfill when a wallet is added. It uses Helius Enhanced Transaction history with the `balanceChanged` token-account filter and is safe to repeat.
- Helius LaserStream `transactionSubscribe` monitoring for tracked wallet addresses, restored by Next.js instrumentation when the single Pulse server starts.
- Provider-neutral `TradeEvent` and `TransferEvent` persistence and SSE delivery of normalized events to the browser.

## Event model and deduplication

Events have a provider-neutral `eventIdentity`, enforced by a PostgreSQL unique index. It is derived from the transaction signature and stable event position (`trade:<wallet>`, `native:<index>`, or `token:<index>`). This removes duplicates from backfill/realtime overlap and provider retries without relying on process memory.

Trade classification is deliberately conservative: only a material native SOL balance change (at least 0.01 SOL) paired with an opposing token balance change is a trade. SOL out/token in is a buy; token out/SOL in is a sell. Fee-sized balance changes and ambiguous token-to-token activity are not manufactured into buy/sell events. Transfers are emitted separately from Helius native and SPL transfer records. Helius does not provide a reliable market cap here, so market cap and USD values stay nullable.

## Helius integration

The provider uses the authenticated mainnet endpoint for parsed address history and transaction parsing, plus LaserStream WebSocket `transactionSubscribe` at confirmed commitment. Those APIs were selected because Helius supplies parsed transaction/account data and a transaction-level address filter without exposing raw provider data to the UI. Requests retry transient 408/429/5xx responses with bounded exponential backoff. Secrets and raw payloads are never logged or sent to browsers.

Server startup restores subscriptions from persisted Solana wallets. New events are persisted before being published over the `/api/events` Server-Sent Events route. This is intentionally a single-server v0.1 design; it does not use distributed coordination, Redis, Kafka, or a webhook endpoint.

## Provider credentials and status

Credentials resolve server-side from `HELIUS_API_KEY` (then the future secure settings store). The key is never included in a response, client component, or log. The provider health contract reports configured/available state and a checked timestamp; the settings surface is the intended home for it.

## Planned

- HOOD / Alchemy runtime integration
- Social tracking
- Reliable token pricing and market-cap enrichment
- Advanced analytics, alerts, sound/highlight behavior, authentication, billing, and multi-instance coordination

## Known v0.1 limitations

Enhanced transaction fields do not guarantee token symbols or prices, so unknown symbols and null prices are preserved rather than guessed. The current dashboard’s fixture UI remains the explicit no-database demo surface; configure `DATABASE_URL` and `HELIUS_API_KEY`, run the migrations, then use the API-backed ingestion path for real tracking.
