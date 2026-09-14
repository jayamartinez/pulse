"use client";

import { ChevronRight, FolderPlus, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { ActivityTable } from "@/components/activity-table";
import { Button, ChainBadge, SectionHeader } from "@/components/ui";
import { lists, wallets } from "@/lib/data";

export function ListsView() {
  const [selected, setSelected] = useState(0);
  const active = lists[selected];

  return <div className="grid items-start gap-x-10 gap-y-10 lg:grid-cols-[300px_minmax(0,1fr)]">
    <section className="overflow-hidden border-t border-[var(--border)] lg:border-r lg:pr-8">
      <SectionHeader title="Your lists" detail={`${lists.length} total`} action={<button aria-label="Create list" className="grid h-7 w-7 place-items-center text-[var(--muted)] hover:text-white"><Plus className="h-3 w-3" /></button>} />
      <div className="divide-y divide-[var(--border)]">{lists.map((list, index) => <button key={list.name} onClick={() => setSelected(index)} className={`group flex h-[62px] w-full items-center rounded-md px-2 text-left transition-colors ${selected === index ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface)]"}`}>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className={`text-[13px] font-medium ${selected === index ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>{list.name}</span><span className="text-[11px] text-[var(--muted-2)]">{list.count}</span></div><div className="mt-1.5 flex items-center gap-2 text-[10px] text-[var(--muted-2)]"><span>{list.solana} Solana</span><span>·</span><span>{list.hood} HOOD</span><span className="ml-auto">{list.lastActivity}</span></div></div>
        <ChevronRight className={`ml-3 h-3.5 w-3.5 ${selected === index ? "text-[var(--text)]" : "text-[var(--muted-2)] opacity-0 group-hover:opacity-100"}`} />
      </button>)}</div>
      <button className="flex h-11 w-full items-center gap-2 border-t border-[var(--border)] text-[12px] text-[var(--muted)] hover:text-white"><FolderPlus className="h-3.5 w-3.5" />Create new list</button>
    </section>

    <section className="border-y border-[var(--border)]">
      <div className="flex min-h-[82px] items-center justify-between gap-4"><div><div className="flex items-baseline gap-2"><h2 className="text-[19px] font-semibold tracking-[-.03em]">{active.name}</h2><span className="text-[11px] text-[var(--muted-2)]">{active.count} wallets</span></div><div className="mt-2 flex items-center gap-3"><ChainBadge chain="Solana" />{active.hood > 0 && <ChainBadge chain="HOOD" />}<span className="ml-2 text-[11px] text-[var(--muted)]">{active.volume} in 24h flow</span></div></div><Button variant="secondary"><MoreHorizontal className="h-3.5 w-3.5" />Manage</Button></div>
      <div className="grid grid-cols-3 border-t border-[var(--border)]"><MiniMetric label="Wallets" value={String(active.count)} /><MiniMetric label="Events today" value={String(active.count * 7 + 3)} /><MiniMetric label="24h volume" value={active.volume} /></div>
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] py-3 text-[11px]"><span className="mr-1 text-[var(--muted-2)]">Included</span>{active.members.map(member => { const wallet = wallets.find(item => item.name === member); return <span key={member} className="text-[var(--muted)]">{wallet?.emoji && <span className="mr-1.5">{wallet.emoji}</span>}{member}</span>; })}{active.count > active.members.length && <span className="text-[var(--muted-2)]">+{active.count - active.members.length}</span>}</div>
    </section>

    <section className="overflow-hidden border-t border-[var(--border)] lg:col-span-2"><SectionHeader title="Combined activity" detail={`From ${active.name}`} /><ActivityTable limit={9} showFilters={false} allowedWallets={active.members} /></section>
  </div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="border-r border-[var(--border)] py-3 last:border-r-0 [&:not(:first-child)]:pl-5"><div className="text-[11px] text-[var(--muted)]">{label}</div><div className="tabular mt-1 text-[16px] font-medium text-[var(--text)]">{value}</div></div>;
}
