"use client";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { AddWalletButton } from "@/components/add-wallet-sheet";
import { Button } from "@/components/ui";
import { dashboardWalletsToTransferRecords } from "@/lib/application/wallet-transfer";
import { exportWalletTransfer, parseWalletTransferFile } from "@/lib/wallet-transfer";
import { wallets } from "@/lib/data";

export function ActivityActions() {
  const inputRef = useRef<HTMLInputElement>(null);
  function download() {
    const body = JSON.stringify(exportWalletTransfer(dashboardWalletsToTransferRecords(wallets)), null, 2);
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([body], { type: "application/json" })); link.download = "pulse-wallets.json"; link.click();
  }
  async function importFile(file?: File) { if (!file) return; const parsed = parseWalletTransferFile(await file.text()); if (parsed.entries.length) alert(`${parsed.entries.length} wallet${parsed.entries.length === 1 ? "" : "s"} ready to import. Manage the final import in Settings.`); }
  return <div className="flex items-center gap-2"><AddWalletButton /><Button variant="secondary" onClick={download}><Download className="h-3.5 w-3.5" />Export</Button><Button variant="secondary" onClick={() => inputRef.current?.click()}><Upload className="h-3.5 w-3.5" />Import</Button><input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" onChange={event => { void importFile(event.target.files?.[0]); event.target.value = ""; }} /></div>;
}
