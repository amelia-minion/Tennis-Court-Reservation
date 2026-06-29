import { NextRequest, NextResponse } from "next/server";
import {
  coachRedirectWithSession,
  verifyCoachCredentials,
} from "@/lib/coach-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email?.trim() || !password) {
    return NextResponse.redirect(
      new URL("/coach/login?error=missing", request.url),
      303
    );
  }

  if (!verifyCoachCredentials(email, password)) {
    return NextResponse.redirect(
      new URL("/coach/login?error=invalid", request.url),
      303
    );
  }

  return coachRedirectWithSession(
    email,
    new URL("/coach/dashboard", request.url)
  );
}
