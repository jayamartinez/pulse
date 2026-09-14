import { Check, CircleDot, RefreshCw, ServerCog } from "lucide-react";
import { ChainBadge, Metric, PageHeader, SectionHeader, StatusIndicator } from "@/components/ui";

export default function SystemPage() {
  return <div className="fade-up">
    <PageHeader title="System" description="Ingestion health, throughput, and detection performance." actions={<StatusIndicator label="All systems operational" />} />
    <section className="mb-8 flex flex-wrap gap-x-12 gap-y-2 border-y border-[var(--border)]"><Metric label="Events processed" value="48.2M" detail="ALL TIME" /><Metric label="Throughput" value="55/min" detail="CURRENT" /><Metric label="Median latency" value="62ms" detail="−4MS" /><Metric label="P95 latency" value="148ms" detail="TARGET <200" /></section>
    <div className="space-y-10">
      <section className="border-t border-[var(--border)]"><SectionHeader title="Network streams" detail="Provider connections" /><div className="divide-y divide-[var(--border)]"><StreamDetail chain="Solana" provider="Helius" events="38 / min" median="54ms" last="8 sec ago" reconnects="1" /><StreamDetail chain="HOOD" provider="Alchemy" events="17 / min" median="96ms" last="22 sec ago" reconnects="0" /></div></section>
      <section className="border-t border-[var(--border)]"><SectionHeader title="Event pipeline" detail="End-to-end path" /><div className="overflow-x-auto py-6"><div className="grid min-w-[720px] grid-cols-5 border-y border-[var(--border)]">{["Ingestion", "Normalization", "Persistence", "WebSocket", "Client"].map((stage, index) => <div key={stage} className="border-r border-[var(--border)] px-4 py-5 last:border-r-0"><div className="text-[10px] text-[var(--muted-2)]">Step {index + 1}</div><div className="mt-3 text-[13px] font-medium text-[var(--text)]">{stage}</div><div className="mt-1 text-[11px] text-[var(--positive)]">{["19ms", "7ms", "12ms", "16ms", "8ms"][index]} · Healthy</div></div>)}</div></div></section>
    </div>
    <section className="mt-10 border-t border-[var(--border)]"><SectionHeader title="Processing quality" detail="Last 24 hours" /><div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] border-b border-[var(--border)] md:grid-cols-4 md:divide-y-0"><SystemMetric icon={CircleDot} label="Last event" value="8 sec ago" /><SystemMetric icon={RefreshCw} label="Reconnect count" value="1" /><SystemMetric icon={ServerCog} label="Duplicates filtered" value="3,811" /><SystemMetric icon={Check} label="Delivery success" value="99.998%" /></div></section>
  </div>;
}

function StreamDetail({ chain, provider, events, median, last, reconnects }: { chain: "Solana" | "HOOD"; provider: string; events: string; median: string; last: string; reconnects: string }) {
  return <div className="grid grid-cols-[1fr_repeat(4,minmax(70px,110px))] items-center gap-4 py-4"><div><div className="flex items-center gap-3"><ChainBadge chain={chain} /><StatusIndicator label="Connected" /></div><div className="mt-2 text-[11px] text-[var(--muted)]">Provider · {provider}</div></div><StreamValue label="Events" value={events} /><StreamValue label="Median" value={median} /><StreamValue label="Last event" value={last} /><StreamValue label="Reconnects" value={reconnects} /></div>;
}
function StreamValue({ label, value }: { label: string; value: string }) { return <div className="text-right"><div className="text-[10px] text-[var(--muted-2)]">{label}</div><div className="mono mt-1 text-[11px] text-[var(--text)]">{value}</div></div>; }
function SystemMetric({ icon: Icon, label, value }: { icon: typeof CircleDot; label: string; value: string }) { return <div className="flex items-center gap-3 py-4 [&:not(:first-child)]:pl-5"><Icon className="h-3.5 w-3.5 text-[var(--muted)]" /><div><div className="text-[10px] text-[var(--muted-2)]">{label}</div><div className="tabular mt-1 text-[13px] font-medium text-[var(--text)]">{value}</div></div></div>; }
