import { NextRequest, NextResponse } from "next/server";
import {
  applyCoachSessionCookies,
  verifyCoachCredentials,
} from "@/lib/coach-auth";

export const runtime = "nodejs";

function loginRedirectPage(target: string) {
  const safeTarget = target.startsWith("/") ? target : "/coach/dashboard";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${safeTarget}" />
    <title>Signing in…</title>
  </head>
  <body>
    <p>Signing you in… <a href="${safeTarget}">Continue</a></p>
  </body>
</html>`;
}

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

  const response = new NextResponse(loginRedirectPage("/coach/dashboard"), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

  applyCoachSessionCookies(response, email);

  return response;
}
