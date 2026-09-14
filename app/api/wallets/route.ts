import { NextResponse } from "next/server";
import { addSolanaWallet } from "@/lib/application/solana-ingestion";
import { normalizeSolanaAddress } from "@/lib/domain/solana-address";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const address = normalizeSolanaAddress(typeof body.address === "string" ? body.address : "");
    const wallet = await addSolanaWallet({ chain: "solana", address, name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : null, emoji: typeof body.emoji === "string" ? body.emoji : null, labels: stringList(body.labels), lists: stringList(body.lists), alertsOnToast: true, alertsOnBubble: true, alertsOnFeed: true, sound: "default", highlightColor: null });
    return NextResponse.json(wallet, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add wallet." }, { status: 400 }); }
}
function stringList(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
