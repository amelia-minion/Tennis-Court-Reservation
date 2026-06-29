import { NextRequest, NextResponse } from "next/server";
import {
  coachHtmlRedirectResponse,
  resolveCoachAuth,
} from "@/lib/coach-auth";
import {
  lessonFlashFromParams,
  lessonFlashFromResult,
  scheduleLessonFromForm,
} from "@/lib/coach-lessons";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const runtime = "nodejs";

function dashboardPath(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/coach/dashboard", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
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

  if ("success" in result && result.success) {
    const params: Record<string, string> = {
      lesson: "success",
      count: String(result.count),
    };

    if (result.recurring && !result.seriesLinked) {
      params.series_linked = "0";
    }

    const flash = lessonFlashFromParams(params, t);
    const message = flash?.message ?? t.coachSuccessLesson;

    return coachHtmlRedirectResponse(
      coachEmail,
      dashboardPath(request, params),
      message
    );
  }

  const flash = lessonFlashFromResult(result, t);
  const params: Record<string, string> = {
    lesson_error: flash.error ?? "generic",
  };

  if ("conflictDate" in result) {
    params.conflict_date = result.conflictDate;
  }

  return coachHtmlRedirectResponse(
    coachEmail,
    dashboardPath(request, params),
    flash.message ?? t.coachErrGeneric
  );
}
