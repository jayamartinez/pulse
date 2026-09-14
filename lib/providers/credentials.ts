import "server-only";

import type { Chain } from "@/lib/domain/chain";

export type ProviderCredentialOrigin = "environment" | "settings" | "unavailable";

export type ResolvedProviderCredential = {
  origin: ProviderCredentialOrigin;
  apiKey?: string;
};

export interface ProviderSettingsStore {
  getApiKey(chain: Chain): Promise<string | undefined>;
}

const environmentKeyNames: Record<Chain, "HELIUS_API_KEY" | "ALCHEMY_API_KEY"> = {
  solana: "HELIUS_API_KEY",
  hood: "ALCHEMY_API_KEY",
};

export async function resolveProviderCredential(
  chain: Chain,
  settingsStore?: ProviderSettingsStore,
): Promise<ResolvedProviderCredential> {
  const environmentKey = process.env[environmentKeyNames[chain]];

  if (environmentKey) {
    return { origin: "environment", apiKey: environmentKey };
  }

  const settingsKey = await settingsStore?.getApiKey(chain);
  if (settingsKey) {
    return { origin: "settings", apiKey: settingsKey };
  }

  return { origin: "unavailable" };
}
