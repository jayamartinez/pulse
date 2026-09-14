export const chains = ["solana", "hood"] as const;

export type Chain = (typeof chains)[number];

export const chainDisplayNames: Record<Chain, "Solana" | "HOOD"> = {
  solana: "Solana",
  hood: "HOOD",
};
