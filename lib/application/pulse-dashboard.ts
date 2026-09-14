import type { ActivityAction, Chain, Wallet } from "@/lib/data";
import { mockDashboardRepository } from "@/lib/repositories/mock-dashboard-repository";

export type { Activity, ActivityAction, Chain, Wallet } from "@/lib/data";

// This client-safe boundary is backed by static fixtures until database reads are introduced.
export const pulseDashboard = {
  listActivities: () => mockDashboardRepository.listActivities(),
  listWalletLists: () => mockDashboardRepository.listWalletLists(),
  listWallets: () => mockDashboardRepository.listWallets(),
};

export const dashboardActivities = pulseDashboard.listActivities();
export const dashboardLists = pulseDashboard.listWalletLists();
export const dashboardWallets = pulseDashboard.listWallets();

export type DashboardChain = Chain;
export type DashboardActivityAction = ActivityAction;
export type DashboardWallet = Wallet;
