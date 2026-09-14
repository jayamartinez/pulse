import assert from "node:assert/strict";
import test from "node:test";
import { normalizeHeliusTransaction } from "./helius-normalizer.ts";

const wallet = "2fg5QD1eD7rzNNCsvnhmXFm5hqNgwTTG8p7kQ6f3rx6f";
const transaction = (nativeBalanceChange: number, tokenBalanceChanges: Array<{ mint: string; tokenAmount: number }>) => ({ signature: "test-signature", timestamp: 1_700_000_000, type: "SWAP", accountData: [{ account: wallet, nativeBalanceChange, tokenBalanceChanges }] });

test("normalizes a clear SOL-out swap as a buy", () => {
  const events = normalizeHeliusTransaction(transaction(-2_000_000_000, [{ mint: "token", tokenAmount: 4 }]), wallet);
  assert.equal(events[0]?.kind, "trade");
  assert.equal(events[0]?.kind === "trade" && events[0].side, "buy");
});

test("normalizes a clear SOL-in swap as a sell", () => {
  const events = normalizeHeliusTransaction(transaction(2_000_000_000, [{ mint: "token", tokenAmount: -4 }]), wallet);
  assert.equal(events[0]?.kind, "trade");
  assert.equal(events[0]?.kind === "trade" && events[0].side, "sell");
});

test("does not classify a fee-sized native delta as a trade", () => {
  const events = normalizeHeliusTransaction(transaction(-5_000, [{ mint: "token", tokenAmount: 4 }]), wallet);
  assert.equal(events.some(event => event.kind === "trade"), false);
});
