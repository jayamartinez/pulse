"use client";

import { ArrowRight, MoreHorizontal, Tags } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChainBadge, Label, SearchInput, Select } from "@/components/ui";
import { WalletIdentity } from "@/components/wallet-identity";
import { wallets } from "@/lib/data";

export function WalletsTable() {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState("All");
  const [label, setLabel] = useState("All");
  const visible = useMemo(() => wallets.filter(wallet =>
    (chain === "All" || wallet.chain === chain) &&
    (label === "All" || wallet.labels.includes(label)) &&
    (!search || [wallet.name, wallet.address, wallet.list, ...wallet.labels].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [search, chain, label]);

  return <section className="overflow-hidden border-t border-[var(--border)]">
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] py-3">
      <span className="mr-2 hidden text-[12px] text-[var(--muted)] md:block">Filters</span>
      <SearchInput value={search} onChange={event => setSearch(event.target.value)} placeholder="Search wallets or addresses" className="w-full sm:w-[240px]" />
      <Select value={chain} onChange={event => setChain(event.target.value)} className="w-[128px]"><option value="All">All chains</option><option>Solana</option><option>HOOD</option></Select>
      <Select value={label} onChange={event => setLabel(event.target.value)} className="w-[132px]"><option value="All">All labels</option><option>smart money</option><option>whale</option><option>active</option><option>developer</option></Select>
    </div>
    <div className="overflow-x-auto"><div className="min-w-[920px]">
      <div className="grid h-10 grid-cols-[minmax(220px,1.5fr)_90px_126px_minmax(170px,1fr)_82px_110px_92px_30px] items-center border-b border-[var(--border)] text-[11px] font-medium text-[var(--muted)]"><span>Wallet</span><span>Chain</span><span>List</span><span>Labels</span><span className="text-right">Events</span><span className="text-right">Volume</span><span className="text-right">Last seen</span><span /></div>
      {visible.map(wallet => <div key={wallet.slug} className="group grid h-[58px] grid-cols-[minmax(220px,1.5fr)_90px_126px_minmax(170px,1fr)_82px_110px_92px_30px] items-center border-b border-[var(--border)] transition-colors hover:bg-[var(--surface)]">
        <WalletIdentity wallet={wallet} /><ChainBadge chain={wallet.chain} /><span className="truncate text-[12px] text-[var(--muted)]">{wallet.list}</span>
        <div className="flex gap-1.5">{wallet.labels.map(item => <Label key={item}>{item}</Label>)}</div>
        <span className="tabular text-right text-[12px] text-[var(--muted)]">{wallet.events24h}</span><span className="tabular text-right text-[12px] font-medium text-[var(--text)]">{wallet.volume24h}</span><span className="text-right text-[11px] text-[var(--muted)]">{wallet.lastSeen}</span>
        <Link aria-label={`Open ${wallet.name}`} href={`/wallets/${wallet.slug}`} className="ml-auto grid h-7 w-7 place-items-center text-[var(--muted-2)] opacity-0 hover:text-[var(--text)] group-hover:opacity-100"><ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>)}
      {visible.length === 0 && <div className="grid h-44 place-items-center text-center"><div><Tags className="mx-auto mb-2 h-4 w-4 text-[var(--muted-2)]" /><p className="text-[13px] text-[var(--text)]">No wallets found</p><p className="mt-1 text-[12px] text-[var(--muted)]">Adjust your search or filters.</p></div></div>}
    </div></div>
    <div className="flex h-10 items-center justify-between text-[11px] text-[var(--muted-2)]"><span>{visible.length} of 36 wallets</span><button className="grid h-7 w-7 place-items-center hover:text-white"><MoreHorizontal className="h-4 w-4" /></button></div>
  </section>;
}
