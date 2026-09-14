import assert from "node:assert/strict";
import test from "node:test";
import { applyWalletImport, exportWalletTransfer, inferWalletChain, parseWalletTransferFile, walletTransferDefaults } from "./index.ts";

const solana = "2fg5QD1eD7rzNNCsvnhmXFm5hqNgwTTG8p7kQ6f3rx6f";
const evm = "0x71d9aB3F2e8C6140a2f523fD94B2b64860524977";
const entry = (overrides: Record<string, unknown> = {}) => ({ trackedWalletAddress: solana, name: "cupsey", emoji: "🥤", alertsOnToast: true, alertsOnBubble: true, alertsOnFeed: true, groups: ["Main", "NEW"], sound: "default", highlightColor: null, ...overrides });

test("infers Solana and 0x wallets", () => {
  assert.equal(inferWalletChain(solana), "solana");
  assert.equal(inferWalletChain(evm), "hood");
});

test("preserves arbitrary and multi-codepoint emoji with nullable names", () => {
  const parsed = parseWalletTransferFile(JSON.stringify([entry({ name: null, emoji: "👁️‍🗨️" })]));
  assert.equal(parsed.issues.length, 0);
  assert.deepEqual(parsed.entries[0].name, null);
  assert.equal(parsed.entries[0].emoji, "👁️‍🗨️");
});

test("creates groups, applies defaults, and round-trips preserved settings", () => {
  const parsed = parseWalletTransferFile(JSON.stringify([entry({ groups: ["Main", "NEW"], ...walletTransferDefaults, sound: "chime", highlightColor: "#6d5dfc" })]));
  const result = applyWalletImport(parsed.entries, [], [], parsed.issues);
  assert.deepEqual(result.lists, ["Main", "NEW"]);
  assert.equal(result.listsCreated, 2);
  assert.deepEqual(exportWalletTransfer(result.wallets), [entry({ groups: ["Main", "NEW"], sound: "chime", highlightColor: "#6d5dfc" })]);
});

test("deduplicates by normalized chain and address while preserving current metadata", () => {
  const initial = parseWalletTransferFile(JSON.stringify([entry({ name: null, emoji: null, groups: ["Main"] })])).entries;
  const imported = parseWalletTransferFile(JSON.stringify([entry({ name: "incoming", emoji: "💙", groups: ["NEW"] })])).entries;
  const result = applyWalletImport(imported, initial, ["Main"]);
  assert.equal(result.imported, 0);
  assert.equal(result.duplicates, 1);
  assert.deepEqual(result.wallets[0].groups, ["Main", "NEW"]);
  assert.equal(result.wallets[0].name, "incoming");
  assert.equal(result.wallets[0].emoji, "💙");
});

test("skips malformed entries without discarding valid wallets", () => {
  const parsed = parseWalletTransferFile(JSON.stringify([entry(), entry({ trackedWalletAddress: "not a wallet" })]));
  const result = applyWalletImport(parsed.entries, [], [], parsed.issues);
  assert.equal(result.imported, 1);
  assert.equal(result.skipped, 1);
});
