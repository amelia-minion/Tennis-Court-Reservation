import { NextRequest, NextResponse } from "next/server";
import {
  applyCoachSessionCookies,
  verifyCoachCredentials,
} from "@/lib/coach-auth";

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

  const response = NextResponse.redirect(
    new URL("/coach/dashboard", request.url),
    303
  );

  applyCoachSessionCookies(response, email);

  return response;
}
