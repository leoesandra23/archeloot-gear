import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "archeloot-gear-calculator",
    version: "v18",
    node: process.version,
    timestamp: new Date().toISOString(),
  });
}
