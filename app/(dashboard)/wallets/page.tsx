import { AddWalletButton } from "@/components/add-wallet-sheet";
import { WalletsTable } from "@/components/wallets-table";
import { PageHeader } from "@/components/ui";

export default function WalletsPage() {
  return <div className="fade-up"><PageHeader title="Wallets" description="Track, label, and organize wallet activity." actions={<AddWalletButton />} /><WalletsTable /></div>;
}
