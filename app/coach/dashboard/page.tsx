import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getLoggedInCoachEmail, requireCoach } from "@/lib/coach-auth";
import { lessonFlashFromParams } from "@/lib/coach-lessons";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import {
  COACH_SCHEDULING_DAYS_AHEAD,
  getTodayKey,
  getWindowEndKey,
} from "@/lib/scheduling";
import LessonForm from "./LessonForm";
import ScheduleCalendar from "./ScheduleCalendar";

type Props = {
  searchParams: Promise<{
    lesson?: string;
    lesson_error?: string;
    count?: string;
    conflict_date?: string;
    series_linked?: string;
  }>;
};

export default async function CoachDashboardPage({ searchParams }: Props) {
  await requireCoach();

  const locale = await getLocale();
  const t = getDictionary(locale);
  const flashParams = await searchParams;
  const flash = lessonFlashFromParams(flashParams, t);
  const startDate = getTodayKey();
  const endDate = getWindowEndKey(COACH_SCHEDULING_DAYS_AHEAD);

  const [{ data: reservations }, { data: lessons, error: lessonsError }] =
    await Promise.all([
      supabase
        .from("reservations")
        .select("*")
        .gte("reservation_date", startDate)
        .lte("reservation_date", endDate)
        .order("reservation_date")
        .order("start_time"),
      supabase
        .from("lessons")
        .select("*")
        .gte("lesson_date", startDate)
        .lte("lesson_date", endDate)
        .order("lesson_date")
        .order("start_time"),
    ]);

  const loggedInEmail = await getLoggedInCoachEmail();

  return (
    <main className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-800">
              {t.coachDashboardTitle}
            </h1>
            <p className="text-gray-600 mt-1">
              {t.coachSignedInAs} {loggedInEmail}
            </p>
          </div>

          <Link
            href="/coach/logout"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            {t.coachLogOut}
          </Link>
        </div>

        <LessonForm
          locale={locale}
          today={startDate}
          maxDate={endDate}
          flash={flash}
        />

        <ScheduleCalendar
          locale={locale}
          reservations={reservations ?? []}
          lessons={lessons ?? []}
          lessonsError={Boolean(lessonsError)}
        />
      </div>
    </main>
  );
}
