"use client";

import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button, Input, Label, Select } from "@/components/ui";

export function AddWalletButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emoji, setEmoji] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => { setOpen(false); setSaved(false); }, 850);
  }

  return <>
    <Button variant={compact ? "ghost" : "primary"} className={compact ? "w-full justify-start border-0 px-3 text-[13px] text-[#aaaab0]" : ""} onClick={() => setOpen(true)}><Plus className="h-4 w-4" />{compact ? "Add wallet" : "Add wallet"}</Button>
    {open && <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[1px]" onMouseDown={() => setOpen(false)}>
      <aside className="sheet-enter absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-[var(--border-strong)] bg-[var(--sidebar)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <div><h2 className="text-[15px] font-semibold text-white">Add wallet</h2><p className="mt-0.5 text-[11px] text-[var(--muted)]">Start tracking activity in real time.</p></div>
          <button aria-label="Close" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center text-[var(--muted)] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form className="flex flex-1 flex-col" onSubmit={submit}>
          <div className="space-y-5 p-5">
            <Field label="Wallet address" required><Input autoFocus required placeholder="Paste a Solana or HOOD address" className="mono" /></Field>
            <Field label="Chain" hint="Pulse can usually detect this automatically."><Select className="w-full" defaultValue="auto"><option value="auto">Auto-detect</option><option>Solana</option><option>HOOD</option></Select></Field>
            <Field label="Custom name"><Input placeholder="e.g. Smart Money 02" /></Field>
            <Field label="Emoji" hint="Optional. A quick visual cue for this wallet."><div className="flex flex-wrap gap-2">{["🐋", "🦈", "🎯", "👀", "🧑‍💻", "⭐"].map(item => <button key={item} type="button" aria-label={`Use ${item}`} onClick={() => setEmoji(emoji === item ? "" : item)} className={`grid h-9 w-9 place-items-center rounded-md border text-[17px] transition ${emoji === item ? "border-[var(--text)] bg-[var(--surface-2)]" : "border-[var(--border)] hover:border-[var(--border-strong)]"}`}>{item}</button>)}</div></Field>
            <Field label="Labels"><Input placeholder="Add labels" /><div className="mt-2 flex gap-1.5"><Label>smart money</Label><Label>whale</Label><button type="button" className="text-[11px] text-[var(--muted)] hover:text-white">+ Create label</button></div></Field>
            <Field label="Lists"><Select className="w-full"><option>No list</option><option>Smart Money</option><option>Whales</option><option>HOOD Traders</option><option>Developers</option></Select></Field>
          </div>
          <div className="mt-auto flex items-center justify-end gap-2 border-t border-[var(--border)] p-4"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" className="min-w-28">{saved ? <><Check className="h-3.5 w-3.5" />Tracking</> : "Add wallet"}</Button></div>
        </form>
      </aside>
    </div>}
  </>;
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[12px] font-medium text-[var(--text)]">{label}{required && <span className="ml-1 text-[var(--muted)]">*</span>}</span>{children}{hint && <span className="mt-1.5 block text-[11px] text-[var(--muted-2)]">{hint}</span>}</label>;
}
