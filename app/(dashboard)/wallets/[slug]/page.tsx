import { Edit3, FolderPlus, MoreHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import { ActivityTable } from "@/components/activity-table";
import { CopyButton } from "@/components/copy-button";
import { Button, ChainBadge, Label, Metric, SectionHeader } from "@/components/ui";
import { WalletIdentity } from "@/components/wallet-identity";
import { wallets } from "@/lib/data";

export default async function WalletDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wallet = wallets.find(item => item.slug === slug);
  if (!wallet) notFound();
  return <div className="fade-up">
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><WalletIdentity wallet={wallet} linked={false} prominent /><div className="mt-4 flex items-center gap-2.5"><ChainBadge chain={wallet.chain} />{wallet.labels.map(label => <Label key={label}>{label}</Label>)}</div></div><div className="flex items-center gap-2"><Button variant="secondary"><Edit3 className="h-3 w-3" />Edit</Button><Button variant="secondary"><FolderPlus className="h-3 w-3" />Add to list</Button><CopyButton value={wallet.address} /><Button variant="ghost" aria-label="More"><MoreHorizontal className="h-3.5 w-3.5" /></Button></div></header>
    <section className="mb-8 flex flex-wrap gap-x-12 gap-y-2 border-y border-[var(--border)]"><Metric label="24h buys" value="18" detail="$72.4K" /><Metric label="24h sells" value="11" detail="$54.1K" /><Metric label="24h volume" value={wallet.volume24h} detail="+12.6%" /><Metric label="Last activity" value="8s" detail="46ms latency" /></section>
    <div className="grid items-start gap-10 2xl:grid-cols-[minmax(0,1fr)_260px]">
      <section className="overflow-hidden border-t border-[var(--border)]"><SectionHeader title="Recent activity" detail={`Detected for ${wallet.name}`} /><ActivityTable limit={12} showFilters={false} initialWallet={wallet.name} /></section>
      <section className="border-t border-[var(--border)]"><SectionHeader title="Observed assets" detail="Non-custodial" /><div className="divide-y divide-[var(--border)]"><Holding token="SOL" balance="1,284.20" value="$253,168" share="58%" /><Holding token="USDC" balance="91,420.00" value="$91,420" share="21%" /><Holding token="WIF" balance="816,400" value="$55,515" share="13%" /><Holding token="JUP" balance="132,800" value="$27,454" share="6%" /></div><div className="py-3 text-[10px] leading-relaxed text-[var(--muted-2)]">Observed balances may omit unsupported assets.</div></section>
    </div>
  </div>;
}

function Holding({ token, balance, value, share }: { token: string; balance: string; value: string; share: string }) {
  return <div className="flex h-14 items-center"><div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--surface-2)] text-[11px] font-medium text-[var(--muted)]">{token[0]}</div><div className="ml-2.5"><div className="text-[12px] font-medium text-[var(--text)]">{token}</div><div className="mono mt-0.5 text-[10px] text-[var(--muted-2)]">{balance}</div></div><div className="ml-auto text-right"><div className="tabular text-[12px] text-[var(--text)]">{value}</div><div className="mt-0.5 text-[10px] text-[var(--muted-2)]">{share}</div></div></div>;
}
