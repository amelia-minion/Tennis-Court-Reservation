import { NextRequest, NextResponse } from "next/server";
import {
  coachRedirectWithSession,
  resolveCoachAuth,
} from "@/lib/coach-auth";
import { deleteLessonById } from "@/lib/coach-lessons";

export const runtime = "nodejs";

function dashboardUrl(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/coach/dashboard", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const coachEmail = resolveCoachAuth({
    cookieStore: request.cookies,
    formToken: formData.get("coach_token") as string | null,
  });

  if (!coachEmail) {
    return NextResponse.redirect(
      new URL("/coach/login?error=session", request.url),
      303
    );
  }

  const id = formData.get("id") as string;
  const result = await deleteLessonById(id);

  if ("success" in result && result.success) {
    return coachRedirectWithSession(
      coachEmail,
      dashboardUrl(request, { lesson_deleted: "1" })
    );
  }

  return coachRedirectWithSession(
    coachEmail,
    dashboardUrl(request, { lesson_error: "delete_failed" })
  );
}
