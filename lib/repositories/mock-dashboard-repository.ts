import { activities, lists, wallets } from "@/lib/data";
import type { DashboardRepository } from "@/lib/repositories/dashboard-repository";

export const mockDashboardRepository: DashboardRepository = {
  listActivities: () => activities,
  listWallets: () => wallets,
  listWalletLists: () => lists,
};
