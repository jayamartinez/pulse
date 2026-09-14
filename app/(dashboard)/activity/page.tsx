"use client";

import { Radio } from "lucide-react";
import { useState } from "react";
import { ActivityTable } from "@/components/activity-table";
import { ActivityActions } from "@/components/activity-actions";
import { PageHeader, StatusIndicator } from "@/components/ui";

export default function ActivityPage() {
  const [view, setView] = useState<"trades" | "transfers">("trades");
  return <div className="fade-up"><PageHeader title="Activity" description="Live trades and transfers across tracked wallets." actions={<><StatusIndicator label="Streaming" /><ActivityActions /></>} /><section className="overflow-hidden border-t border-[var(--border)]"><div className="flex h-12 items-center gap-1 border-b border-[var(--border)]"><Radio className="mr-2 h-3.5 w-3.5 text-[var(--positive)]" />{([ ["trades", "Live trades"], ["transfers", "Transfers"] ] as const).map(([key, label]) => <button key={key} onClick={() => setView(key)} className={`h-full border-b px-3 text-[13px] ${view === key ? "border-white text-white" : "border-transparent text-[var(--muted)] hover:text-white"}`}>{label}</button>)}</div><ActivityTable view={view} /></section><div className="mt-3 text-[10px] text-[var(--muted-2)]">Showing latest 40 {view}</div></div>;
}
