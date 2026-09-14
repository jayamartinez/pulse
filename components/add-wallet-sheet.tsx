"use client";

import { Check, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { isWalletEmoji } from "@/lib/wallet-transfer";
import { Button, Input, Label, Select } from "@/components/ui";

export function AddWalletButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emoji, setEmoji] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input")?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setSaved(false);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (emoji && !isWalletEmoji(emoji)) return;
    setSaved(true);
    window.setTimeout(close, 850);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled])");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const overlay = open && <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[1px]" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
      <aside ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-wallet-title" onKeyDown={onKeyDown} className="sheet-enter fixed inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col border-l border-[var(--border-strong)] bg-[var(--surface-1)] shadow-2xl shadow-black/40">
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <div><h2 id="add-wallet-title" className="text-[15px] font-semibold text-white">Add wallet</h2><p className="mt-0.5 text-[11px] text-[var(--muted)]">Start tracking activity in real time.</p></div>
          <button type="button" aria-label="Close add wallet" onClick={close} className="grid h-8 w-8 place-items-center text-[var(--muted)] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form className="flex flex-1 flex-col" onSubmit={submit}>
          <div className="space-y-5 overflow-y-auto p-5">
            <Field label="Wallet address" required><Input required placeholder="Paste a Solana or HOOD address" className="mono" /></Field>
            <Field label="Chain" hint="Pulse can usually detect this automatically."><Select className="w-full" defaultValue="auto"><option value="auto">Auto-detect</option><option>Solana</option><option>HOOD</option></Select></Field>
            <Field label="Custom name"><Input placeholder="e.g. Smart Money 02" /></Field>
            <Field label="Emoji" hint="Optional. Paste or type one standard emoji."><Input value={emoji} onChange={event => setEmoji(event.target.value)} aria-invalid={Boolean(emoji && !isWalletEmoji(emoji))} maxLength={32} placeholder="🥤" className="w-20 text-center text-[17px]" />{emoji && !isWalletEmoji(emoji) && <span className="mt-1.5 block text-[11px] text-[var(--red)]">Use one emoji, including supported multi-codepoint emoji.</span>}</Field>
            <Field label="Labels"><Input placeholder="Add labels" /><div className="mt-2 flex gap-1.5"><Label>smart money</Label><Label>whale</Label><button type="button" className="text-[11px] text-[var(--muted)] hover:text-white">+ Create label</button></div></Field>
            <Field label="Lists"><Select className="w-full"><option>No list</option><option>Smart Money</option><option>Whales</option><option>HOOD Traders</option><option>Developers</option></Select></Field>
          </div>
          <div className="mt-auto flex items-center justify-end gap-2 border-t border-[var(--border)] p-4"><Button type="button" variant="ghost" onClick={close}>Cancel</Button><Button type="submit" disabled={Boolean(emoji && !isWalletEmoji(emoji))} className="min-w-28">{saved ? <><Check className="h-3.5 w-3.5" />Tracking</> : "Add wallet"}</Button></div>
        </form>
      </aside>
    </div>;

  return <>
    <Button variant={compact ? "ghost" : "primary"} className={compact ? "w-full justify-start border-0 px-3 text-[13px] text-[#aaaab0]" : ""} onClick={event => { openerRef.current = event.currentTarget; setOpen(true); }}><Plus className="h-4 w-4" />Add wallet</Button>
    {typeof document !== "undefined" && overlay && createPortal(overlay, document.body)}
  </>;
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[12px] font-medium text-[var(--text)]">{label}{required && <span className="ml-1 text-[var(--muted)]">*</span>}</span>{children}{hint && <span className="mt-1.5 block text-[11px] text-[var(--muted-2)]">{hint}</span>}</label>;
}
