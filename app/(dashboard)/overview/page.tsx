import { ArrowRight, Radio } from "lucide-react";
import Link from "next/link";
import { ActivityTable } from "@/components/activity-table";
import { AddWalletButton } from "@/components/add-wallet-sheet";
import { ChainBadge, PageHeader, SectionHeader, StatusIndicator } from "@/components/ui";
import { WalletIdentity } from "@/components/wallet-identity";
import { dashboardWallets } from "@/lib/application/pulse-dashboard";

export default function OverviewPage() {
  return <div className="fade-up">
    <PageHeader title="Overview" description="Wallet intelligence / Solana + Robinhood Chain" actions={<><StatusIndicator label="All streams live" /><AddWalletButton /></>} />
    <div className="space-y-10">
      <section className="overflow-hidden border-t border-[var(--border)]">
        <SectionHeader title="Live activity" detail="Streaming now" action={<Link href="/activity" className="flex items-center gap-1 text-[12px] text-[var(--muted)] hover:text-white">Full stream <ArrowRight className="h-3.5 w-3.5" /></Link>} />
        <ActivityTable limit={10} view="trades" />
      </section>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <section className="border-t border-[var(--border)]">
          <SectionHeader title="Recently active" detail="Last 60 min" />
          <div className="divide-y divide-[var(--border)]">{dashboardWallets.slice(0, 5).map(wallet => <div key={wallet.slug} className="flex h-14 items-center justify-between"><WalletIdentity wallet={wallet} /><div className="ml-3 text-right"><div className="tabular text-[12px] text-[var(--text)]">{wallet.volume24h}</div><div className="mt-1 text-[10px] text-[var(--muted-2)]">{wallet.lastSeen}</div></div></div>)}</div>
        </section>
        <section className="border-t border-[var(--border)]">
          <SectionHeader title="Stream health" action={<StatusIndicator label="Healthy" />} />
          <div className="space-y-4 py-4">
            <StreamRow label="Solana" latency="54ms" events="38 / min" />
            <StreamRow label="HOOD" latency="96ms" events="17 / min" hood />
            <div className="border-t border-[var(--border)] pt-3 text-[11px] text-[var(--muted-2)]"><Radio className="mr-1.5 inline h-3.5 w-3.5 text-[var(--positive)]" />Last event 8 seconds ago</div>
          </div>
        </section>
      </div>
    </div>
  </div>;
}

function StreamRow({ label, latency, events, hood = false }: { label: string; latency: string; events: string; hood?: boolean }) {
  return <div className="flex items-center gap-2"><ChainBadge chain={hood ? "HOOD" : "Solana"} /><span className="sr-only">{label}</span><span className="ml-auto text-[11px] text-[var(--muted)]">{events}</span><span className="mono w-12 text-right text-[10px] text-[var(--positive)]">{latency}</span></div>;
}

