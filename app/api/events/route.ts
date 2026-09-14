import { subscribeToWalletEvents } from "@/lib/realtime/event-bus";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  const stream = new ReadableStream({
    start(controller) { unsubscribe = subscribeToWalletEvents(event => controller.enqueue(encoder.encode(`event: wallet-event\\ndata: ${JSON.stringify(event)}\\n\\n`))); request.signal.addEventListener("abort", () => { unsubscribe(); controller.close(); }); },
    cancel() { unsubscribe(); },
  });
  return new Response(stream, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform", connection: "keep-alive" } });
}
