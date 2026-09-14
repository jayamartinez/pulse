import Link from "next/link";
import type { DashboardWallet } from "@/lib/application/pulse-dashboard";

export function WalletIdentity({ wallet, linked = true, prominent = false }: { wallet: Pick<DashboardWallet, "name" | "address" | "slug" | "emoji">; linked?: boolean; prominent?: boolean }) {
  const body = <div className={`flex min-w-0 items-center ${prominent ? "gap-3" : "gap-2.5"}`}>
    {wallet.emoji && <span aria-hidden className={`shrink-0 leading-none ${prominent ? "text-[25px]" : "text-[17px]"}`}>{wallet.emoji}</span>}
    <div className="min-w-0"><div className={`truncate font-medium text-[var(--text)] ${prominent ? "text-[22px] tracking-[-.03em]" : "text-[13px]"}`}>{wallet.name}</div><div className={`mono mt-0.5 truncate text-[var(--muted-2)] ${prominent ? "text-[11px]" : "text-[10px]"}`}>{wallet.address}</div></div>
  </div>;
  return linked ? <Link href={`/wallets/${wallet.slug}`} className="block hover:opacity-90">{body}</Link> : body;
}
