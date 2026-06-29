import { NextRequest, NextResponse } from "next/server";
import { resolveCoachAuth } from "@/lib/coach-auth";
import {
  lessonFlashFromResult,
  scheduleLessonFromForm,
} from "@/lib/coach-lessons";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const runtime = "nodejs";

function dashboardUrl(request: NextRequest) {
  return new URL("/coach/dashboard", request.url);
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

  const locale = await getLocale();
  const t = getDictionary(locale);
  const result = await scheduleLessonFromForm(formData);
  const redirectUrl = dashboardUrl(request);

  if ("success" in result && result.success) {
    redirectUrl.searchParams.set("lesson", "success");
    redirectUrl.searchParams.set("count", String(result.count));

    if (result.recurring && !result.seriesLinked) {
      redirectUrl.searchParams.set("series_linked", "0");
    }

    return NextResponse.redirect(redirectUrl, 303);
  }

  const flash = lessonFlashFromResult(result, t);
  redirectUrl.searchParams.set("lesson_error", flash.error ?? "generic");

  if ("conflictDate" in result) {
    redirectUrl.searchParams.set("conflict_date", result.conflictDate);
  }

  return NextResponse.redirect(redirectUrl, 303);
}
