import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getDictionary } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import {
  COACH_SCHEDULING_DAYS_AHEAD,
  findSchedulingConflicts,
  generateWeeklyLessonDates,
  getWindowEndKey,
  isDateWithinWindow,
  normalizeTime,
} from "@/lib/scheduling";

const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"];

export type LessonFlash = {
  error: string | null;
  success: boolean;
  message: string | null;
};

type ScheduleResult =
  | { error: "missing_fields" }
  | { error: "invalid_court" }
  | { error: "outside_window" }
  | { error: "lessons_table_missing" }
  | { error: "generic" }
  | { error: "court_taken"; conflictDate: string }
  | {
      success: true;
      count: number;
      recurring: boolean;
      seriesLinked: boolean;
    };

function calculateEndTime(startTime: string, durationHours: number) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationHours * 60;
  const endHours = Math.floor(endMinutes / 60);
  const remainingMinutes = endMinutes % 60;

  return `${String(endHours).padStart(2, "0")}:${String(
    remainingMinutes
  ).padStart(2, "0")}`;
}

export async function scheduleLessonFromForm(
  formData: FormData
): Promise<ScheduleResult> {
  const title = (formData.get("title") as string)?.trim();
  const court = formData.get("court") as string;
  const lesson_date = formData.get("lesson_date") as string;
  const start_time = formData.get("start_time") as string;
  const duration_hours = Number(formData.get("duration_hours"));
  const notes = (formData.get("notes") as string)?.trim() || null;
  const repeat_weekly = formData.get("repeat_weekly") === "yes";

  if (!title || !court || !lesson_date || !start_time || !duration_hours) {
    return { error: "missing_fields" };
  }

  if (!COURTS.includes(court)) {
    return { error: "invalid_court" };
  }

  if (!isDateWithinWindow(lesson_date, COACH_SCHEDULING_DAYS_AHEAD)) {
    return { error: "outside_window" };
  }

  const end_time = calculateEndTime(start_time, duration_hours);
  const normalizedStart = normalizeTime(start_time);
  const normalizedEnd = normalizeTime(end_time);
  const coachWindowEnd = getWindowEndKey(COACH_SCHEDULING_DAYS_AHEAD);

  const lessonDates = repeat_weekly
    ? generateWeeklyLessonDates(lesson_date, coachWindowEnd)
    : [lesson_date];

  for (const date of lessonDates) {
    const { reservationError, lessonError, hasConflict } =
      await findSchedulingConflicts(
        court,
        date,
        normalizedStart,
        normalizedEnd
      );

    if (reservationError || lessonError) {
      console.error("Conflict check failed:", reservationError || lessonError);

      if (lessonError?.code === "PGRST205") {
        return { error: "lessons_table_missing" };
      }

      return { error: "generic" };
    }

    if (hasConflict) {
      return { error: "court_taken", conflictDate: date };
    }
  }

  const series_id = repeat_weekly ? randomUUID() : null;

  const buildRows = (includeSeriesId: boolean) =>
    lessonDates.map((date) => {
      const row: Record<string, string | null> = {
        title,
        court,
        lesson_date: date,
        start_time: normalizedStart,
        end_time: normalizedEnd,
        notes,
      };

      if (includeSeriesId && series_id) {
        row.series_id = series_id;
      }

      return row;
    });

  let rows = buildRows(true);
  let { error } = await supabase.from("lessons").insert(rows);

  if (
    error?.code === "PGRST204" &&
    error.message.includes("series_id") &&
    repeat_weekly
  ) {
    rows = buildRows(false);
    ({ error } = await supabase.from("lessons").insert(rows));
  }

  if (error) {
    console.error("Failed to schedule lesson:", error);

    if (error.code === "PGRST205") {
      return { error: "lessons_table_missing" };
    }

    return { error: "generic" };
  }

  revalidatePath("/coach/dashboard");
  revalidatePath("/courts", "layout");

  return {
    success: true,
    count: rows.length,
    recurring: repeat_weekly,
    seriesLinked: Boolean(series_id && rows[0]?.series_id),
  };
}

export function lessonFlashFromResult(
  result: ScheduleResult,
  t: ReturnType<typeof getDictionary>
): LessonFlash {
  if ("success" in result && result.success) {
    const count = result.count;
    let message =
      result.recurring && count > 1
        ? t.coachSuccessWeeklyLessons.replace("{count}", String(count))
        : t.coachSuccessLesson;

    if (result.recurring && result.seriesLinked === false) {
      message += t.coachSeriesGroupingHint;
    }

    return { error: null, success: true, message };
  }

  if ("error" in result && result.error === "court_taken") {
    const dateNote = result.conflictDate ? ` (${result.conflictDate})` : "";

    return {
      error: "court_taken",
      success: false,
      message: t.coachErrCourtTaken.replace("{date}", dateNote),
    };
  }

  if ("error" in result && result.error === "outside_window") {
    return {
      error: "outside_window",
      success: false,
      message: t.coachErrOutsideWindow,
    };
  }

  if ("error" in result && result.error === "lessons_table_missing") {
    return {
      error: "lessons_table_missing",
      success: false,
      message: t.coachErrLessonsTableMissing,
    };
  }

  return {
    error: "error" in result ? result.error : "generic",
    success: false,
    message: t.coachErrGeneric,
  };
}

export function lessonFlashFromParams(
  params: {
    lesson?: string;
    lesson_error?: string;
    count?: string;
    conflict_date?: string;
    series_linked?: string;
  },
  t: ReturnType<typeof getDictionary>
): LessonFlash | null {
  if (params.lesson === "success") {
    const count = Number(params.count ?? "1");
    const recurring = count > 1;

    let message = recurring
      ? t.coachSuccessWeeklyLessons.replace("{count}", String(count))
      : t.coachSuccessLesson;

    if (params.series_linked === "0") {
      message += t.coachSeriesGroupingHint;
    }

    return { error: null, success: true, message };
  }

  if (!params.lesson_error) {
    return null;
  }

  if (params.lesson_error === "unauthorized") {
    return {
      error: "unauthorized",
      success: false,
      message: t.coachErrUnauthorized,
    };
  }

  if (params.lesson_error === "court_taken") {
    const dateNote = params.conflict_date ? ` (${params.conflict_date})` : "";

    return {
      error: "court_taken",
      success: false,
      message: t.coachErrCourtTaken.replace("{date}", dateNote),
    };
  }

  if (params.lesson_error === "outside_window") {
    return {
      error: "outside_window",
      success: false,
      message: t.coachErrOutsideWindow,
    };
  }

  if (params.lesson_error === "lessons_table_missing") {
    return {
      error: "lessons_table_missing",
      success: false,
      message: t.coachErrLessonsTableMissing,
    };
  }

  return {
    error: params.lesson_error,
    success: false,
    message: t.coachErrGeneric,
  };
}

export async function deleteLessonById(
  id: string
): Promise<{ success: true } | { error: "generic" }> {
  if (!id) {
    return { error: "generic" };
  }

  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete lesson:", error);
    return { error: "generic" };
  }

  revalidatePath("/coach/dashboard");
  revalidatePath("/courts", "layout");

  return { success: true };
}

export function dashboardFlashFromParams(
  params: {
    lesson?: string;
    lesson_error?: string;
    lesson_deleted?: string;
    count?: string;
    conflict_date?: string;
    series_linked?: string;
  },
  t: ReturnType<typeof getDictionary>
): LessonFlash | null {
  if (params.lesson_deleted === "1") {
    return {
      error: null,
      success: true,
      message: t.coachSuccessLessonDeleted,
    };
  }

  if (params.lesson_error === "delete_failed") {
    return {
      error: "delete_failed",
      success: false,
      message: t.coachErrDeleteLesson,
    };
  }

  return lessonFlashFromParams(params, t);
}
