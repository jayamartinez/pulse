"use client";

import { Activity, List, Menu, Settings, WalletCards, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AddWalletButton } from "@/components/add-wallet-sheet";
import { PulseMark } from "@/components/pulse-mark";
import { StatusIndicator } from "@/components/ui";

const primary = [
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/wallets", label: "Wallets", icon: WalletCards },
  { href: "/lists", label: "Lists", icon: List },
];
const secondary = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="min-h-screen bg-[var(--bg)]">
    <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="fixed left-3 top-3 z-30 grid h-8 w-8 place-items-center border border-[var(--border)] bg-[var(--surface-1)] text-[var(--muted)] lg:hidden"><Menu className="h-3.5 w-3.5" /></button>
    {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[218px] flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-14 items-center gap-2.5 px-4"><PulseMark /><span className="text-[15px] font-semibold tracking-[-.02em]">Pulse</span><button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-4 w-4 text-[var(--muted)]" /></button></div>
      <nav className="mt-2 space-y-1 px-2">{primary.map(item => <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} onClick={() => setMobileOpen(false)} />)}<AddWalletButton compact /></nav>
      <div className="mt-auto"><nav className="space-y-1 px-2 pb-4">{secondary.map(item => <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} onClick={() => setMobileOpen(false)} />)}</nav><div className="border-t border-[var(--border)] px-4 py-4"><div className="flex items-center justify-between"><StatusIndicator label="connected" /><span className="text-[10px] text-[var(--muted-2)]">v0.1.0</span></div><div className="mt-1.5 text-[11px] text-[var(--muted)]">Solana + HOOD</div></div></div>
    </aside>
    <main className="min-h-screen lg:pl-[218px]"><div className="mx-auto w-full max-w-[1450px] px-4 pb-16 pt-16 sm:px-7 lg:px-8 lg:pt-6">{children}</div></main>
  </div>;
}

function NavItem({ href, label, icon: Icon, active, onClick }: { href: string; label: string; icon: typeof Activity; active: boolean; onClick: () => void }) {
  return <Link href={href} onClick={onClick} className={`flex h-9 items-center gap-2.5 rounded-md px-3 text-[13px] transition-colors ${active ? "bg-[#1a1a1c] font-medium text-white" : "text-[#aaaab0] hover:bg-[#151516] hover:text-white"}`}><Icon className={`h-4 w-4 ${active ? "text-[#e5e5e5]" : "text-[#77777d]"}`} />{label}</Link>;
}
