import { NextResponse } from "next/server";
import { listPersistedEvents } from "@/lib/application/solana-ingestion";

export const runtime = "nodejs";
export async function GET() { try { return NextResponse.json({ mode: "database", events: await listPersistedEvents() }); } catch { return NextResponse.json({ mode: "demo", events: [] }); } }
