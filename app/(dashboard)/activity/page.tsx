import { Download, Radio } from "lucide-react";
import { ActivityTable } from "@/components/activity-table";
import { Button, PageHeader, StatusIndicator } from "@/components/ui";

export default function ActivityPage() {
  return <div className="fade-up">
    <PageHeader title="Activity" description="Every detected event across 36 tracked wallets." actions={<><StatusIndicator label="Streaming" /><Button variant="secondary"><Download className="h-3.5 w-3.5" />Export</Button></>} />
    <section className="overflow-hidden border-t border-[var(--border)]">
      <div className="flex h-11 items-center justify-between border-b border-[var(--border)]"><div className="flex items-center gap-2"><Radio className="h-3.5 w-3.5 text-[var(--positive)]" /><h2 className="text-[13px] font-medium">Event stream</h2></div><div className="text-[11px] text-[var(--muted-2)]">1,284 events in 24 hours</div></div>
      <ActivityTable />
    </section>
    <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--muted-2)]"><span>Showing latest 40 events</span><span className="mono">Median detection 62ms</span></div>
  </div>;
}
