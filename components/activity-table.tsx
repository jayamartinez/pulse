"use client";

import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { activities, type ActivityAction, type Chain } from "@/lib/data";
import { ActionBadge, ChainBadge, SearchInput, Select } from "@/components/ui";

export function ActivityTable({ limit, showFilters = true, initialWallet = "All", allowedWallets }: { limit?: number; showFilters?: boolean; initialWallet?: string; allowedWallets?: string[] }) {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState<"All" | Chain>("All");
  const [action, setAction] = useState<"All" | ActivityAction>("All");
  const [wallet, setWallet] = useState(initialWallet);

  const visible = useMemo(() => {
    const query = search.toLowerCase();
    return activities.filter(item =>
      (!allowedWallets || allowedWallets.includes(item.wallet)) &&
      (chain === "All" || item.chain === chain) &&
      (action === "All" || item.action === action) &&
      (wallet === "All" || item.wallet === wallet) &&
      (!query || [item.wallet, item.address, item.token, item.value, item.tx].some(value => value.toLowerCase().includes(query)))
    ).slice(0, limit);
  }, [search, chain, action, wallet, limit, allowedWallets]);

  return <>
    {showFilters && <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] py-3">
      <span className="mr-2 hidden text-[12px] text-[var(--muted)] md:block">Filters</span>
      <SearchInput value={search} onChange={event => setSearch(event.target.value)} placeholder="Search wallet, asset, tx" className="w-full sm:w-[220px]" />
      <Select value={chain} onChange={event => setChain(event.target.value as "All" | Chain)} className="w-[142px]"><option value="All">All chains</option><option>Solana</option><option>HOOD</option></Select>
      <Select value={action} onChange={event => setAction(event.target.value as "All" | ActivityAction)} className="w-[148px]"><option value="All">All activity</option><option>Buy</option><option>Sell</option><option>Swap</option><option>Transfer</option></Select>
      <Select value={wallet} onChange={event => setWallet(event.target.value)} className="w-[180px]"><option value="All">All wallets</option><option value="Smart Money 01">🐋 Smart Money 01</option><option value="westside.sol">👀 westside.sol</option><option value="HOOD Whale">🦈 HOOD Whale</option><option value="Dev Wallet">🧑‍💻 Dev Wallet</option><option value="Momentum">🎯 Momentum</option></Select>
      <button aria-label="More filters" className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-white"><SlidersHorizontal className="h-4 w-4" /></button>
    </div>}
    <div className="overflow-x-auto">
      <div className="min-w-[970px]">
        <div className="grid h-10 grid-cols-[78px_minmax(190px,1.5fr)_90px_minmax(136px,1fr)_140px_120px_82px_74px_34px] items-center border-b border-[var(--border)] text-[11px] font-medium text-[var(--muted)]">
          <span>Action</span><span>Wallet</span><span>Chain</span><span>Token</span><span className="text-right">Amount</span><span className="text-right">Value</span><span className="text-right">Time</span><span className="text-right">Latency</span><span />
        </div>
        {visible.map((item, index) => <div key={item.id} className={`group grid h-14 grid-cols-[78px_minmax(190px,1.5fr)_90px_minmax(136px,1fr)_140px_120px_82px_74px_34px] items-center border-b border-[var(--border)] text-[12px] transition-colors hover:bg-[var(--surface)] ${index === 0 ? "row-enter" : ""}`}>
          <ActionBadge action={item.action} />
          <div className="flex min-w-0 items-center gap-2">{item.emoji && <span aria-hidden className="text-[16px]">{item.emoji}</span>}<div className="min-w-0"><div className="truncate font-medium text-[var(--text)]">{item.wallet}</div><div className="mono mt-0.5 text-[10px] text-[var(--muted-2)]">{item.address}</div></div></div>
          <ChainBadge chain={item.chain} />
          <div className="min-w-0"><div className="truncate font-medium text-[var(--text)]">{item.token}</div>{item.tokenAddress && <div className="mono mt-0.5 text-[10px] text-[var(--muted-2)]">{item.tokenAddress}</div>}</div>
          <span className="tabular truncate text-right text-[#92969a]">{item.amount}</span>
          <span className="tabular text-right font-medium text-[var(--text)]">{item.value}</span>
          <span className="text-right text-[11px] text-[var(--muted)]">{item.time}</span>
          <span className="mono text-right text-[10px] text-[var(--muted-2)]">{item.latency}ms</span>
          <a href="#" onClick={event => event.preventDefault()} aria-label={`Open transaction ${item.tx}`} className="ml-auto grid h-6 w-6 place-items-center text-[var(--muted-2)] opacity-0 transition hover:text-[var(--accent)] group-hover:opacity-100"><ArrowUpRight className="h-3 w-3" /></a>
        </div>)}
        {visible.length === 0 && <div className="grid h-40 place-items-center text-center"><div><p className="text-[13px] text-[var(--text)]">No activity found</p><p className="mt-1 text-[12px] text-[var(--muted)]">Try changing your filters.</p></div></div>}
      </div>
    </div>
  </>;
}
