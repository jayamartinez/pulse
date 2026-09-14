import { Bell, Database, KeyRound, Monitor, ShieldCheck } from "lucide-react";
import { Button, Input, PageHeader, SectionHeader, Select, StatusIndicator } from "@/components/ui";

export default function SettingsPage() {
  return <div className="fade-up max-w-[900px]">
    <PageHeader title="Settings" description="Connections and workspace preferences." />

    <section className="mb-10 border-t border-[var(--border)]">
      <SectionHeader title="Data providers" detail="Bring your own keys" />
      <p className="max-w-[620px] py-4 text-[12px] leading-5 text-[var(--muted)]">Provider keys stay in your local Pulse configuration. You can also configure them with environment variables when running a hosted instance.</p>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        <Provider chain="Solana" provider="Helius" env="HELIUS_API_KEY" placeholder="••••••••••••••••a71c" latency="54ms" />
        <Provider chain="Robinhood Chain" provider="Alchemy" env="ALCHEMY_API_KEY" placeholder="••••••••••••••••9fd2" latency="96ms" />
      </div>
    </section>

    <section className="border-t border-[var(--border)]">
      <SectionHeader title="Preferences" />
      <div className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
        <Setting icon={Monitor} title="Appearance" description="Use the calm dark workspace or follow your system." control={<Select className="w-32"><option>Dark</option><option>System</option></Select>} />
        <Setting icon={Database} title="Default chain" description="Used when an address cannot be detected automatically." control={<Select className="w-32"><option>Solana</option><option>HOOD</option></Select>} />
        <Setting icon={Bell} title="Live updates" description="Add new events to the activity stream automatically." control={<StatusIndicator label="Enabled" />} />
      </div>
    </section>
  </div>;
}

function Provider({ chain, provider, env, placeholder, latency }: { chain: string; provider: string; env: string; placeholder: string; latency: string }) {
  return <div className="grid gap-4 py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center">
    <div><div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text)]"><KeyRound className="h-4 w-4 text-[var(--muted)]" />{chain}</div><div className="mt-1 pl-6 text-[11px] text-[var(--muted)]">{provider} · {latency}</div></div>
    <div><Input type="password" aria-label={`${provider} API key`} defaultValue={placeholder} className="mono w-full" /><div className="mono mt-1.5 text-[9px] text-[var(--muted-2)]">{env}</div></div>
    <div className="flex items-center gap-3"><span className="flex items-center gap-1.5 text-[11px] text-[var(--positive)]"><ShieldCheck className="h-3.5 w-3.5" />Connected</span><Button variant="secondary">Test connection</Button></div>
  </div>;
}

function Setting({ icon: Icon, title, description, control }: { icon: typeof Monitor; title: string; description: string; control: React.ReactNode }) {
  return <div className="flex min-h-[78px] items-center gap-4"><Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" /><div className="min-w-0"><div className="text-[13px] font-medium text-[var(--text)]">{title}</div><div className="mt-1 text-[11px] text-[var(--muted)]">{description}</div></div><div className="ml-auto pl-6">{control}</div></div>;
}
