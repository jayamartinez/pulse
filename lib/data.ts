export type Chain = "Solana" | "HOOD";
export type ActivityAction = "Buy" | "Sell" | "Swap" | "Transfer";

export type Activity = {
  id: number;
  action: ActivityAction;
  wallet: string;
  emoji?: string;
  address: string;
  chain: Chain;
  token: string;
  tokenAddress?: string;
  amount: string;
  value: string;
  time: string;
  latency: number;
  tx: string;
};

export type Wallet = {
  slug: string;
  name: string;
  address: string;
  emoji?: string;
  chain: Chain;
  list: string;
  labels: string[];
  events24h: number;
  volume24h: string;
  lastSeen: string;
};

export const wallets: Wallet[] = [
  { slug: "smart-money-01", name: "Smart Money 01", emoji: "🐋", address: "7xK4dM9qV2sA8nL5p91", chain: "Solana", list: "Smart Money", labels: ["smart money", "whale"], events24h: 42, volume24h: "$186.4K", lastSeen: "8 sec ago" },
  { slug: "westside-sol", name: "westside.sol", emoji: "👀", address: "9pQ2vL7mT4rN8cK1x53", chain: "Solana", list: "Friends", labels: ["active", "defi"], events24h: 31, volume24h: "$94.8K", lastSeen: "1 min ago" },
  { slug: "hood-whale", name: "HOOD Whale", emoji: "🦈", address: "0x71d9aB3F2e8C6140a2", chain: "HOOD", list: "Whales", labels: ["whale", "hood"], events24h: 18, volume24h: "$311.2K", lastSeen: "22 sec ago" },
  { slug: "dev-wallet", name: "Dev Wallet", emoji: "🧑‍💻", address: "4rN8kP3mX7tB1vQ6e42", chain: "Solana", list: "Developers", labels: ["developer"], events24h: 9, volume24h: "$26.1K", lastSeen: "12 min ago" },
  { slug: "momentum", name: "Momentum", emoji: "🎯", address: "0x93c1E8b7A2dF4096c5", chain: "HOOD", list: "HOOD Traders", labels: ["momentum", "active"], events24h: 27, volume24h: "$128.7K", lastSeen: "3 min ago" },
  { slug: "quiet-conviction", name: "Quiet Conviction", emoji: "🧭", address: "3mV9qA6xL2kR7pT4w88", chain: "Solana", list: "Smart Money", labels: ["long-term"], events24h: 3, volume24h: "$67.0K", lastSeen: "48 min ago" },
  { slug: "hood-market-maker", name: "HOOD Market Maker", emoji: "⚙️", address: "0x42b7F1aD8cE3059b11", chain: "HOOD", list: "HOOD Traders", labels: ["market maker"], events24h: 64, volume24h: "$481.3K", lastSeen: "16 sec ago" },
  { slug: "northstar", name: "Northstar", emoji: "⭐", address: "6tP2nK8vQ4mA9xR1c70", chain: "Solana", list: "Smart Money", labels: ["smart money"], events24h: 14, volume24h: "$73.5K", lastSeen: "7 min ago" },
];

const activitySeed: Omit<Activity, "id" | "time" | "tx">[] = [
  { action: "Buy", wallet: "Smart Money 01", emoji: "🐋", address: "7xK4…5p91", chain: "Solana", token: "WIF", tokenAddress: "EKpQ…zcjm", amount: "124,840 WIF", value: "$8,491.20", latency: 46 },
  { action: "Sell", wallet: "HOOD Whale", emoji: "🦈", address: "0x71…a2", chain: "HOOD", token: "MNTL", tokenAddress: "0xa8…e9", amount: "1.81M MNTL", value: "$14,210.84", latency: 113 },
  { action: "Swap", wallet: "westside.sol", emoji: "👀", address: "9pQ2…x53", chain: "Solana", token: "JUP → SOL", amount: "38,400 JUP", value: "$24,662.10", latency: 58 },
  { action: "Buy", wallet: "Momentum", address: "0x93…c5", chain: "HOOD", token: "HOOD", amount: "4,200 HOOD", value: "$6,783.00", latency: 91 },
  { action: "Transfer", wallet: "Dev Wallet", address: "4rN8…e42", chain: "Solana", token: "USDC", amount: "15,000 USDC", value: "$15,000.00", latency: 72 },
  { action: "Sell", wallet: "Smart Money 01", address: "7xK4…5p91", chain: "Solana", token: "BONK", amount: "42.7M BONK", value: "$9,884.31", latency: 51 },
  { action: "Buy", wallet: "HOOD Market Maker", address: "0x42…11", chain: "HOOD", token: "RWA", amount: "81,200 RWA", value: "$31,901.72", latency: 105 },
  { action: "Swap", wallet: "Northstar", address: "6tP2…c70", chain: "Solana", token: "SOL → USDC", amount: "92.4 SOL", value: "$18,210.55", latency: 64 },
  { action: "Transfer", wallet: "Quiet Conviction", address: "3mV9…w88", chain: "Solana", token: "SOL", amount: "250 SOL", value: "$49,276.80", latency: 89 },
  { action: "Buy", wallet: "westside.sol", address: "9pQ2…x53", chain: "Solana", token: "JTO", amount: "18,900 JTO", value: "$44,793.00", latency: 43 },
  { action: "Sell", wallet: "Momentum", address: "0x93…c5", chain: "HOOD", token: "CYBR", amount: "210,000 CYBR", value: "$17,640.00", latency: 119 },
  { action: "Swap", wallet: "HOOD Whale", address: "0x71…a2", chain: "HOOD", token: "HOOD → USDC", amount: "11,000 HOOD", value: "$17,776.00", latency: 102 },
];

const relativeTimes = ["8 sec", "22 sec", "41 sec", "1 min", "2 min", "3 min", "5 min", "7 min", "9 min", "12 min", "16 min", "21 min", "28 min", "34 min", "41 min", "48 min", "56 min", "1 hr"];

export const activities: Activity[] = Array.from({ length: 40 }, (_, index) => {
  const seed = activitySeed[index % activitySeed.length];
  return {
    ...seed,
    emoji: seed.emoji ?? wallets.find(wallet => wallet.name === seed.wallet)?.emoji,
    id: index + 1,
    time: relativeTimes[Math.min(Math.floor(index / 2), relativeTimes.length - 1)],
    latency: seed.latency + (index % 5) * 7,
    tx: `${index % 2 === 0 ? "5Fm" : "0x8c"}${(7834 + index * 173).toString(16)}…${(91 + index).toString(16)}`,
  };
});

export const lists = [
  { name: "Smart Money", count: 12, solana: 9, hood: 3, volume: "$428.2K", lastActivity: "8 sec ago", members: ["Smart Money 01", "Northstar", "Quiet Conviction"] },
  { name: "Whales", count: 8, solana: 5, hood: 3, volume: "$1.24M", lastActivity: "22 sec ago", members: ["HOOD Whale", "Smart Money 01"] },
  { name: "HOOD Traders", count: 7, solana: 0, hood: 7, volume: "$684.9K", lastActivity: "41 sec ago", members: ["HOOD Whale", "Momentum", "HOOD Market Maker"] },
  { name: "Developers", count: 5, solana: 4, hood: 1, volume: "$82.5K", lastActivity: "12 min ago", members: ["Dev Wallet"] },
  { name: "Friends", count: 4, solana: 3, hood: 1, volume: "$34.1K", lastActivity: "2 hr ago", members: ["westside.sol"] },
];
