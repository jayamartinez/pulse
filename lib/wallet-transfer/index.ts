import type { Chain } from "../domain/chain";

export const walletTransferDefaults = {
  alertsOnToast: true,
  alertsOnBubble: true,
  alertsOnFeed: true,
  sound: "default",
  highlightColor: null,
} as const;

export type WalletTransferEntry = {
  trackedWalletAddress: string;
  name: string | null;
  emoji: string | null;
  alertsOnToast: boolean;
  alertsOnBubble: boolean;
  alertsOnFeed: boolean;
  groups: string[];
  sound: string;
  highlightColor: string | null;
};

export type ImportedWallet = WalletTransferEntry & { chain: Chain };
export type WalletTransferRecord = ImportedWallet;

export type WalletImportResult = {
  wallets: WalletTransferRecord[];
  lists: string[];
  imported: number;
  skipped: number;
  duplicates: number;
  listsCreated: number;
  issues: string[];
};

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_ITEMS = 2_000;
const MAX_GROUPS = 50;
const MAX_GROUP_LENGTH = 80;
const MAX_EMOJI_LENGTH = 32;
const solanaAddressPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;
const emojiPattern = /\p{Extended_Pictographic}/u;

export function inferWalletChain(address: string): Chain | null {
  if (evmAddressPattern.test(address)) return "hood";
  if (solanaAddressPattern.test(address)) return "solana";
  return null;
}

export function normalizeWalletAddress(address: string, chain: Chain): string {
  const trimmed = address.trim();
  return chain === "hood" ? trimmed.toLowerCase() : trimmed;
}

export function isWalletEmoji(value: string): boolean {
  if (!value || value.length > MAX_EMOJI_LENGTH || !emojiPattern.test(value)) return false;
  const segments = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)];
  return segments.length === 1;
}

export function parseWalletTransferFile(source: string): { entries: ImportedWallet[]; issues: string[] } {
  if (new TextEncoder().encode(source).byteLength > MAX_FILE_BYTES) {
    return { entries: [], issues: ["File is larger than 2 MB."] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    return { entries: [], issues: ["File is not valid JSON."] };
  }

  if (!Array.isArray(parsed)) return { entries: [], issues: ["The file must contain a top-level array."] };
  if (parsed.length > MAX_ITEMS) return { entries: [], issues: [`The file contains more than ${MAX_ITEMS} wallets.`] };

  const entries: ImportedWallet[] = [];
  const issues: string[] = [];
  parsed.forEach((item, index) => {
    const result = parseWalletTransferEntry(item);
    if (result.entry) entries.push(result.entry);
    else issues.push(`Item ${index + 1}: ${result.issue}`);
  });
  return { entries, issues };
}

export function applyWalletImport(
  incoming: ImportedWallet[],
  existingWallets: WalletTransferRecord[],
  existingLists: string[],
  issues: string[] = [],
): WalletImportResult {
  const wallets = existingWallets.map(wallet => ({ ...wallet, groups: [...wallet.groups] }));
  const lists = [...existingLists];
  let imported = 0;
  let duplicates = 0;
  let listsCreated = 0;

  for (const candidate of incoming) {
    const address = normalizeWalletAddress(candidate.trackedWalletAddress, candidate.chain);
    const matchingIndex = wallets.findIndex(wallet => wallet.chain === candidate.chain && normalizeWalletAddress(wallet.trackedWalletAddress, wallet.chain) === address);
    const nextGroups = unique(candidate.groups);

    for (const group of nextGroups) {
      if (!lists.includes(group)) {
        lists.push(group);
        listsCreated += 1;
      }
    }

    if (matchingIndex === -1) {
      wallets.push({ ...candidate, trackedWalletAddress: address, groups: nextGroups });
      imported += 1;
      continue;
    }

    duplicates += 1;
    const existing = wallets[matchingIndex];
    wallets[matchingIndex] = {
      ...existing,
      name: existing.name ?? candidate.name,
      emoji: existing.emoji ?? candidate.emoji,
      groups: unique([...existing.groups, ...nextGroups]),
    };
  }

  return { wallets, lists, imported, skipped: issues.length, duplicates, listsCreated, issues };
}

export function exportWalletTransfer(wallets: WalletTransferRecord[]): WalletTransferEntry[] {
  return wallets.map(wallet => ({
    trackedWalletAddress: wallet.trackedWalletAddress,
    name: wallet.name,
    emoji: wallet.emoji,
    alertsOnToast: wallet.alertsOnToast,
    alertsOnBubble: wallet.alertsOnBubble,
    alertsOnFeed: wallet.alertsOnFeed,
    groups: [...wallet.groups],
    sound: wallet.sound,
    highlightColor: wallet.highlightColor,
  }));
}

function parseWalletTransferEntry(value: unknown): { entry?: ImportedWallet; issue?: string } {
  if (!isRecord(value)) return { issue: "must be an object" };
  const address = value.trackedWalletAddress;
  if (typeof address !== "string" || !address.trim()) return { issue: "trackedWalletAddress must be a non-empty string" };
  const chain = inferWalletChain(address.trim());
  if (!chain) return { issue: "wallet address is not a supported Solana or 0x EVM address" };
  if (!nullableString(value.name)) return { issue: "name must be a string or null" };
  if (!nullableString(value.emoji) || (typeof value.emoji === "string" && !isWalletEmoji(value.emoji))) return { issue: "emoji must be one standard emoji or null" };
  if (typeof value.alertsOnToast !== "boolean" || typeof value.alertsOnBubble !== "boolean" || typeof value.alertsOnFeed !== "boolean") return { issue: "alert settings must be booleans" };
  if (!Array.isArray(value.groups) || value.groups.length > MAX_GROUPS || value.groups.some(group => typeof group !== "string" || !group.trim() || group.length > MAX_GROUP_LENGTH)) return { issue: "groups must be an array of short, non-empty strings" };
  if (typeof value.sound !== "string" || !value.sound.trim() || value.sound.length > 80) return { issue: "sound must be a short, non-empty string" };
  if (!nullableString(value.highlightColor) || (typeof value.highlightColor === "string" && value.highlightColor.length > 80)) return { issue: "highlightColor must be a string or null" };

  return {
    entry: {
      trackedWalletAddress: normalizeWalletAddress(address, chain),
      chain,
      name: value.name,
      emoji: value.emoji,
      alertsOnToast: value.alertsOnToast,
      alertsOnBubble: value.alertsOnBubble,
      alertsOnFeed: value.alertsOnFeed,
      groups: unique(value.groups.map(group => group.trim())),
      sound: value.sound.trim(),
      highlightColor: value.highlightColor,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
