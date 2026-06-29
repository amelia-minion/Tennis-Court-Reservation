import { NextRequest, NextResponse } from "next/server";
import { clearCoachSessionCookies } from "@/lib/coach-auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/coach/login", request.url),
    303
  );

  clearCoachSessionCookies(response);

  return response;
}
