import { NextRequest, NextResponse } from "next/server";
import { clearCoachSession } from "@/lib/coach-auth";

export async function GET(request: NextRequest) {
  await clearCoachSession();
  return NextResponse.redirect(new URL("/coach/login", request.url));
}
