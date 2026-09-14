"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return <Button variant="secondary" onClick={copy}>{copied ? <Check className="h-3.5 w-3.5 text-[var(--green)]" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy address"}</Button>;
}
