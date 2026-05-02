import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data, error: null }, init);
}

export function fail(status: number, message: string) {
  return NextResponse.json({ success: false, data: null, error: message }, { status });
}
