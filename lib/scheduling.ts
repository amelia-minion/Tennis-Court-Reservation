import { supabase } from "@/lib/supabase";

export type ScheduledBlock = {
  date: string;
  start_time: string;
  end_time: string;
};

/** Today + 6 more days = 7 selectable dates for customers */
export const CUSTOMER_BOOKING_DAYS_AHEAD = 6;

/** Coach can schedule up to 30 days from today */
export const COACH_SCHEDULING_DAYS_AHEAD = 30;

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayKey() {
  return formatDateKey(new Date());
}

export function getWindowEndKey(daysAhead: number) {
  const end = new Date();
  end.setDate(end.getDate() + daysAhead);
  return formatDateKey(end);
}

export function isDateWithinWindow(date: string, daysAhead: number) {
  const today = getTodayKey();
  const end = getWindowEndKey(daysAhead);

  return date >= today && date <= end;
}

export function generateWeeklyLessonDates(
  startDate: string,
  maxDate: string
) {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T12:00:00`);
  const limit = new Date(`${maxDate}T12:00:00`);

  while (cursor <= limit) {
    dates.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }

  return dates;
}

export function normalizeTime(time: string) {
  const parts = time.split(":");
  const hours = parts[0]?.padStart(2, "0") ?? "00";
  const minutes = parts[1]?.padStart(2, "0") ?? "00";

  return `${hours}:${minutes}:00`;
}

export function isSlotBlocked(
  slotTime: string,
  blockStart: string,
  blockEnd: string
) {
  const slot = normalizeTime(slotTime).slice(0, 5);
  const start = normalizeTime(blockStart).slice(0, 5);
  const end = normalizeTime(blockEnd).slice(0, 5);

  return slot >= start && slot < end;
}

export function intervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
) {
  const aStart = normalizeTime(startA);
  const aEnd = normalizeTime(endA);
  const bStart = normalizeTime(startB);
  const bEnd = normalizeTime(endB);

  return aStart < bEnd && aEnd > bStart;
}

export function isTimeBlockedOnDate(
  blocks: ScheduledBlock[],
  date: string,
  slotTime: string
) {
  return blocks.some(
    (block) =>
      block.date === date &&
      isSlotBlocked(slotTime, block.start_time, block.end_time)
  );
}

export function isBookingBlocked(
  blocks: ScheduledBlock[],
  date: string,
  startTime: string,
  durationHours: number
) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationHours * 60;
  const endHours = Math.floor(endMinutes / 60);
  const remainingMinutes = endMinutes % 60;
  const endTime = `${String(endHours).padStart(2, "0")}:${String(
    remainingMinutes
  ).padStart(2, "0")}`;

  return blocks.some(
    (block) =>
      block.date === date &&
      intervalsOverlap(
        startTime,
        endTime,
        block.start_time,
        block.end_time
      )
  );
}

export async function findSchedulingConflicts(
  court: string,
  date: string,
  start_time: string,
  end_time: string
) {
  const normalizedStart = normalizeTime(start_time);
  const normalizedEnd = normalizeTime(end_time);

  const [
    { data: reservations, error: reservationError },
    { data: lessons, error: lessonError },
  ] = await Promise.all([
    supabase
      .from("reservations")
      .select("id")
      .eq("court", court)
      .eq("reservation_date", date)
      .lt("start_time", normalizedEnd)
      .gt("end_time", normalizedStart),
    supabase
      .from("lessons")
      .select("id")
      .eq("court", court)
      .eq("lesson_date", date)
      .lt("start_time", normalizedEnd)
      .gt("end_time", normalizedStart),
  ]);

  return {
    reservationError,
    lessonError,
    hasConflict:
      (reservations?.length ?? 0) > 0 || (lessons?.length ?? 0) > 0,
  };
}

export async function fetchCourtBlocks(
  court: string,
  startDate: string,
  endDate: string
): Promise<ScheduledBlock[]> {
  const [{ data: reservations }, { data: lessons }] = await Promise.all([
    supabase
      .from("reservations")
      .select("reservation_date, start_time, end_time")
      .eq("court", court)
      .gte("reservation_date", startDate)
      .lte("reservation_date", endDate),
    supabase
      .from("lessons")
      .select("lesson_date, start_time, end_time")
      .eq("court", court)
      .gte("lesson_date", startDate)
      .lte("lesson_date", endDate),
  ]);

  const reservationBlocks =
    reservations?.map((reservation) => ({
      date: reservation.reservation_date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    })) ?? [];

  const lessonBlocks =
    lessons?.map((lesson) => ({
      date: lesson.lesson_date,
      start_time: lesson.start_time,
      end_time: lesson.end_time,
    })) ?? [];

  return [...reservationBlocks, ...lessonBlocks];
}
