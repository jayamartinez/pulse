import { ChevronDown, Search } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const variants = {
    primary: "border-[#f2f2f1] bg-[#f2f2f1] text-[#111112] hover:border-white hover:bg-white",
    secondary: "border-[var(--border-strong)] bg-[var(--surface-1)] text-[#d0d0d2] hover:border-[#4a4a4e] hover:bg-[var(--surface-2)]",
    ghost: "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-white",
  };
  return <button className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3.5 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface-1)] px-3 text-[13px] text-white outline-none placeholder:text-[var(--muted-2)] hover:border-[var(--border-strong)] focus:border-[#545459] ${className}`} {...props} />;
}

export function SearchInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <label className={`relative block ${className}`}><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-2)]" /><Input className="pl-8" {...props} /></label>;
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <label className={`relative inline-flex ${className}`}><select className="h-9 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--surface-1)] pl-3 pr-8 text-[13px] text-[#c9c9cc] outline-none hover:border-[var(--border-strong)] focus:border-[#545459]" {...props}>{children}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-2)]" /></label>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <header className="mb-8 flex min-h-14 items-start justify-between gap-6 border-b border-[var(--border)] pb-5"><div><h1 className="text-[18px] font-semibold tracking-[-0.025em] text-[var(--text)]">{title}</h1>{description && <p className="mt-1.5 text-[13px] text-[var(--muted)]">{description}</p>}</div>{actions && <div className="flex items-center gap-3">{actions}</div>}</header>;
}

export function SectionHeader({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex h-12 items-center justify-between border-b border-[var(--border)]"><div className="flex items-baseline gap-2.5"><h2 className="text-[14px] font-medium text-[#ececed]">{title}</h2>{detail && <span className="text-[11px] text-[var(--muted-2)]">{detail}</span>}</div>{action}</div>;
}

export function StatusIndicator({ label = "Live", tone = "green" }: { label?: string; tone?: "green" | "amber" | "red" }) {
  const colors = { green: "bg-[var(--green)]", amber: "bg-[var(--amber)]", red: "bg-[var(--red)]" };
  return <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]"><span className={`h-1.5 w-1.5 rounded-full ${colors[tone]} ${tone === "green" ? "live-dot" : ""}`} />{label}</span>;
}

export function ChainBadge({ chain }: { chain: "Solana" | "HOOD" }) {
  return <span className="text-[10px] font-medium uppercase tracking-[.035em] text-[#85858b]">{chain}</span>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-5 items-center rounded border border-[var(--border)] px-1.5 text-[10px] text-[#8e8e94]">{children}</span>;
}

export function ActionBadge({ action }: { action: "Buy" | "Sell" | "Swap" | "Transfer" }) {
  const styles = { Buy: "text-[var(--green)]", Sell: "text-[var(--red)]", Swap: "text-[#b8aa82]", Transfer: "text-[#96969c]" };
  return <span className={`inline-flex items-center gap-2 text-[10px] font-semibold ${styles[action]}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />{action.toUpperCase()}</span>;
}

export function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="min-w-0 py-3 pr-9"><div className="text-[11px] text-[var(--muted)]">{label}</div><div className="mt-1.5 flex items-baseline gap-2"><span className="tabular text-[18px] font-medium tracking-[-0.02em] text-[#ececeb]">{value}</span>{detail && <span className="text-[10px] text-[var(--muted-2)]">{detail}</span>}</div></div>;
}
