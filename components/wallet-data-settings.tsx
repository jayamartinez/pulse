"use client";

import { Download, FileJson, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { applyWalletImport, exportWalletTransfer, parseWalletTransferFile, type ImportedWallet, type WalletTransferRecord } from "@/lib/wallet-transfer";
import { Button } from "@/components/ui";

type PendingImport = { entries: ImportedWallet[]; issues: string[]; filename: string };

export function WalletDataSettings({ initialWallets, initialLists }: { initialWallets: WalletTransferRecord[]; initialLists: string[] }) {
  const [wallets, setWallets] = useState(initialWallets);
  const [lists, setLists] = useState(initialLists);
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function download() {
    const body = JSON.stringify(exportWalletTransfer(wallets), null, 2);
    const url = URL.createObjectURL(new Blob([body], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pulse-wallets.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function selectFile(file: File | undefined) {
    if (!file) return;
    const parsed = parseWalletTransferFile(await file.text());
    setSummary(null);
    setPending({ ...parsed, filename: file.name });
  }

  function confirmImport() {
    if (!pending) return;
    const result = applyWalletImport(pending.entries, wallets, lists, pending.issues);
    setWallets(result.wallets);
    setLists(result.lists);
    setSummary(`${result.imported} wallets imported · ${result.skipped} skipped · ${result.listsCreated} lists created · ${result.duplicates} duplicates merged`);
    setPending(null);
  }

  return <section className="mb-10 border-t border-[var(--border)]">
    <div className="flex h-12 items-center justify-between border-b border-[var(--border)]"><div><h2 className="text-[14px] font-medium text-[#ececed]">Wallet data</h2><p className="mt-0.5 text-[11px] text-[var(--muted-2)]">Import and export tracked wallets and lists.</p></div></div>
    <div className="grid gap-4 border-b border-[var(--border)] py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text)]"><Download className="h-4 w-4 text-[var(--muted)]" />Export wallets</div><p className="mt-1 pl-6 text-[11px] text-[var(--muted)]">Downloads compatible JSON with wallet metadata, lists, and alert preferences. Provider keys and activity history are never included.</p></div><Button variant="secondary" onClick={download}>Export JSON</Button></div>
    <div className="border-b border-[var(--border)] py-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text)]"><Upload className="h-4 w-4 text-[var(--muted)]" />Import wallets</div><p className="mt-1 pl-6 text-[11px] text-[var(--muted)]">Choose or drop a compatible JSON file. Existing wallets keep their metadata; new list memberships are merged.</p></div><Button variant="secondary" onClick={() => inputRef.current?.click()}>Choose JSON</Button></div>
      <input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" onChange={event => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} />
      <div onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); void selectFile(event.dataTransfer.files[0]); }} className="mt-4 flex min-h-20 items-center justify-center border border-dashed border-[var(--border-strong)] bg-[var(--surface-1)] px-4 text-center text-[11px] text-[var(--muted)]">Drop a JSON file here</div>
      {pending && <div className="mt-4 border border-[var(--border-strong)] bg-[var(--surface-2)] p-4"><div className="flex items-center gap-2 text-[12px] font-medium text-[var(--text)]"><FileJson className="h-4 w-4 text-[var(--muted)]" />{pending.filename}</div><p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">{pending.entries.length} valid wallets ready to import. {pending.issues.length} malformed entries will be skipped. This will merge list memberships and only fill a duplicate wallet’s missing name or emoji.</p>{pending.issues.length > 0 && <p className="mt-1 text-[11px] text-[var(--amber)]">First issue: {pending.issues[0]}</p>}<div className="mt-3 flex gap-2"><Button onClick={confirmImport} disabled={pending.entries.length === 0}>Confirm import</Button><Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button></div></div>}
      {summary && <p role="status" className="mt-4 text-[11px] text-[var(--positive)]">{summary}</p>}
    </div>
  </section>;
}
