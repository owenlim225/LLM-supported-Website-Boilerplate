import { ok } from "@/lib/http";

export async function GET() {
  return ok({
    service: "app",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
