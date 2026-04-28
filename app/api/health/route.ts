import { ok } from "@/lib/backend/http";

export async function GET() {
  return ok({
    service: "gdc-aggregator-backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

