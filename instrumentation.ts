export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL || !process.env.HELIUS_API_KEY) return;
  const { restoreSolanaMonitoring } = await import("@/lib/application/solana-ingestion");
  try { await restoreSolanaMonitoring(); console.info(JSON.stringify({ event: "solana_ingestion_started" })); }
  catch (error) { console.warn(JSON.stringify({ event: "solana_ingestion_start_failed", detail: error instanceof Error ? error.message : "unknown" })); }
}
