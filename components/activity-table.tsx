"use client";
import { useEffect, useMemo, useState } from "react";
import { dashboardActivities, type DashboardChain } from "@/lib/application/pulse-dashboard";
import { formatMarketCap, resolveWalletIdentity } from "@/lib/domain/wallet-event";
import { ActionBadge, SearchInput, Select } from "@/components/ui";
import { wallets } from "@/lib/data";

type View = "trades" | "transfers";
export function ActivityTable({ limit, showFilters = true, initialWallet = "All", allowedWallets, view = "trades" }: { limit?: number; showFilters?: boolean; initialWallet?: string; allowedWallets?: string[]; view?: View }) {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState<"All" | DashboardChain>("All");
  const [wallet, setWallet] = useState(initialWallet);
  const [usd, setUsd] = useState(false);
  const [liveActivities, setLiveActivities] = useState<typeof dashboardActivities | null>(null);
  useEffect(() => {
    let active = true;
    void fetch("/api/activity").then(response => response.json()).then((payload: { mode: string; events: RealtimeEvent[] }) => { if (active && payload.mode === "database") setLiveActivities(payload.events.map(toActivity)); }).catch(() => {});
    const stream = new EventSource("/api/events");
    stream.addEventListener("wallet-event", event => { if (!active) return; setLiveActivities(current => [toActivity(JSON.parse((event as MessageEvent<string>).data) as RealtimeEvent), ...(current ?? [])]); });
    return () => { active = false; stream.close(); };
  }, []);
  const activitySource = liveActivities ?? dashboardActivities;
  const visible = useMemo(() => activitySource.filter(item => {
    const transfer = item.action === "Transfer";
    const q = search.toLowerCase();
    return (view === "transfers" ? transfer : !transfer && item.action !== "Swap") && (!allowedWallets || allowedWallets.includes(item.wallet)) && (chain === "All" || item.chain === chain) && (wallet === "All" || item.wallet === wallet) && (!q || [item.wallet, item.address, item.token, item.value ?? "", item.tx].some(value => value.toLowerCase().includes(q)));
  }).slice(0, limit), [activitySource, search, chain, wallet, limit, allowedWallets, view]);
  const amount = (item: typeof dashboardActivities[number]) => usd ? (item.usdValue ? `$${Number(item.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : item.value ?? "—") : item.nativeAmount && item.nativeSymbol ? `${item.nativeAmount} ${item.nativeSymbol}` : item.amount ?? item.tokenAmount ?? "—";
  const marketCap = (item: typeof dashboardActivities[number]) => item.marketCapUsd ?? ({ WIF: "9900", MNTL: "83000", HOOD: "10600", BONK: "83000", RWA: "2250000", JTO: "2250000", CYBR: "10600" }[item.token]);
  return <>
    {showFilters && <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] py-3"><SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search wallet, asset, tx" className="w-full sm:w-[220px]" /><Select value={chain} onChange={e => setChain(e.target.value as "All" | DashboardChain)} className="w-[142px]"><option value="All">All chains</option><option>Solana</option><option>HOOD</option></Select><Select value={wallet} onChange={e => setWallet(e.target.value)} className="w-[180px]"><option value="All">All wallets</option>{wallets.map(item => <option key={item.name}>{item.name}</option>)}</Select></div>}
    <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-[12px]"><thead><tr className="h-10 border-b border-[var(--border)] text-[11px] font-medium text-[var(--muted)]">{view === "trades" ? <><th>Side</th><th>Wallet</th></> : <><th>From</th><th>To</th></>}<th>Token</th><th className="text-right"><button onClick={() => setUsd(!usd)} className="hover:text-white">Amount <span className="ml-1 text-[9px]">{usd ? "USD" : "NATIVE"}</span></button></th><th className="text-right">Market Cap</th><th className="text-right">Time</th></tr></thead><tbody>{visible.map(item => <tr key={item.id} className="h-14 border-b border-[var(--border)] hover:bg-[var(--surface)]">{view === "trades" ? <><td><ActionBadge action={item.action === "Sell" ? "Sell" : "Buy"} /></td><td><div className="flex items-center gap-2">{item.emoji && <span>{item.emoji}</span>}<div><div className="font-medium text-[var(--text)]">{item.wallet}</div><div className="mono text-[10px] text-[var(--muted-2)]">{item.address}</div></div></div></td></> : <><td>{item.transferFrom ? resolveWalletIdentity(item.transferFrom, wallets) : item.address}</td><td>{item.transferToWallet ?? (item.transferTo ? resolveWalletIdentity(item.transferTo, wallets) : "—")}</td></>}<td><div className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--surface-2)] text-[9px]">{item.token.slice(0, 1)}</span><span className="font-medium text-[var(--text)]">{item.token}</span></div></td><td className="text-right tabular text-[#92969a]"><button onClick={() => setUsd(!usd)}>{amount(item)}</button></td><td className="text-right tabular text-[var(--text)]">{formatMarketCap(marketCap(item))}</td><td className="text-right text-[11px] text-[var(--muted)]">{item.time.replace(" sec", "s").replace(" min", "m")}</td></tr>)}</tbody></table></div>
  </>;
}

type RealtimeEvent = { id: string; kind: "trade" | "transfer"; side?: "buy" | "sell"; walletAddress?: string; fromAddress?: string; toAddress?: string; tokenSymbol?: string; tokenAddress?: string; tokenAmount?: string; usdValue?: string; marketCapUsd?: string | null; transactionHash: string };
function toActivity(event: RealtimeEvent): (typeof dashboardActivities)[number] {
  const transfer = event.kind === "transfer";
  const address = transfer ? event.fromAddress : event.walletAddress;
  return { id: event.id.split("").reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) | 0, 0), action: transfer ? "Transfer" : event.side === "sell" ? "Sell" : "Buy", wallet: address ?? "Unknown", address: address ?? "Unknown", chain: "Solana", token: event.tokenSymbol ?? "Unknown", tokenAddress: event.tokenAddress ?? "—", amount: `${event.tokenAmount ?? "0"} ${event.tokenSymbol ?? ""}`.trim(), value: event.usdValue ? `$${event.usdValue}` : undefined, marketCapUsd: event.marketCapUsd ?? undefined, time: "now", latency: 0, tx: event.transactionHash, transferFrom: transfer ? event.fromAddress : undefined, transferTo: transfer ? event.toAddress : undefined };
}
