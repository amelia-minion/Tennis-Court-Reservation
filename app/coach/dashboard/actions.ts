"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { requireCoach } from "@/lib/coach-auth";
import {
  COACH_SCHEDULING_DAYS_AHEAD,
  findSchedulingConflicts,
  generateWeeklyLessonDates,
  getWindowEndKey,
  isDateWithinWindow,
  normalizeTime,
} from "@/lib/scheduling";

const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"];

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

export async function scheduleLesson(formData: FormData) {
  await requireCoach();

  const title = (formData.get("title") as string)?.trim();
  const court = formData.get("court") as string;
  const lesson_date = formData.get("lesson_date") as string;
  const start_time = formData.get("start_time") as string;
  const duration_hours = Number(formData.get("duration_hours"));
  const notes = (formData.get("notes") as string)?.trim() || null;
  const repeat_weekly = formData.get("repeat_weekly") === "yes";

  if (!title || !court || !lesson_date || !start_time || !duration_hours) {
    return { error: "missing_fields" as const };
  }

  if (!COURTS.includes(court)) {
    return { error: "invalid_court" as const };
  }

  if (!isDateWithinWindow(lesson_date, COACH_SCHEDULING_DAYS_AHEAD)) {
    return { error: "outside_window" as const };
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
        return { error: "lessons_table_missing" as const };
      }

      return { error: "generic" as const };
    }

    if (hasConflict) {
      return { error: "court_taken" as const, conflictDate: date };
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
      return { error: "lessons_table_missing" as const };
    }

    return { error: "generic" as const };
  }

  revalidatePath("/coach/dashboard");
  revalidatePath("/courts", "layout");

  return {
    success: true as const,
    count: rows.length,
    recurring: repeat_weekly,
    seriesLinked: Boolean(series_id && rows[0]?.series_id),
  };
}

export async function deleteLesson(formData: FormData) {
  await requireCoach();

  const id = formData.get("id") as string;

  if (!id) {
    return;
  }

  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete lesson:", error);
    return;
  }

  revalidatePath("/coach/dashboard");
  revalidatePath("/courts", "layout");
}
