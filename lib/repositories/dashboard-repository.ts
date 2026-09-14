import type { Activity, Wallet, WalletList } from "@/lib/data";

export interface DashboardRepository {
  listActivities(): Activity[];
  listWallets(): Wallet[];
  listWalletLists(): WalletList[];
}
