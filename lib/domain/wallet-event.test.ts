import assert from "node:assert/strict";
import test from "node:test";
import { classifySwap, formatMarketCap, resolveWalletIdentity } from "./wallet-event.ts";

test("classifies clear SOL entry and exit swaps", () => {
  assert.equal(classifySwap({ walletSent: { symbol: "SOL" }, walletReceived: { symbol: "WIF" } }), "buy");
  assert.equal(classifySwap({ walletSent: { symbol: "WIF" }, walletReceived: { symbol: "SOL" } }), "sell");
});
test("does not guess uncertain swap direction", () => assert.equal(classifySwap({ walletSent: { symbol: "USDC" }, walletReceived: { symbol: "WIF" } }), null));
test("formats market caps and resolves tracked transfer identities", () => {
  assert.equal(formatMarketCap("9900"), "$9.9K");
  assert.equal(formatMarketCap(undefined), "—");
  assert.equal(resolveWalletIdentity("ABC", [{ address: "abc", name: "cupsey", emoji: "🥤" }]), "🥤 cupsey");
  assert.equal(resolveWalletIdentity("unknown", []), "unkno…nown");
});
