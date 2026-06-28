"use client";

import { useEffect, useState } from "react";
import { deleteLesson } from "./actions";
import {
  displayCourt,
  getDictionary,
  localeTag,
  shortCourtLabel,
  type Locale,
} from "@/lib/i18n";

export type CalendarReservation = {
  reservation_code: string;
  customer_name: string;
  phone: string;
  email: string;
  court: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
};

export type CalendarLesson = {
  id: string;
  title: string;
  court: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  series_id: string | null;
};

type SelectedEvent =
  | { type: "reservation"; data: CalendarReservation }
  | { type: "lesson"; data: CalendarLesson };

type Props = {
  locale: Locale;
  dates: string[];
  todayKey: string;
  reservationsByDate: Record<string, CalendarReservation[]>;
  lessonsByDate: Record<string, CalendarLesson[]>;
  startHour: number;
  endHour: number;
  hourHeight: number;
  gridHeight: number;
  courts: string[];
};

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function formatTimeLabel(time: string, locale: Locale) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: locale === "en",
  });
}

function formatDateLabel(dateKey: string, locale: Locale) {
  const date = new Date(`${dateKey}T12:00:00`);
  const [, month, day] = dateKey.split("-");

  return {
    short: `${Number(day)}/${Number(month)}`,
    full: date.toLocaleDateString(localeTag(locale), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_VI = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

function formatDayHeader(dateKey: string, todayKey: string, locale: Locale) {
  const date = new Date(`${dateKey}T12:00:00`);
  const [, month, day] = dateKey.split("-");
  const weekdays = locale === "vi" ? WEEKDAYS_VI : WEEKDAYS_EN;

  return {
    weekday: weekdays[date.getDay()],
    dayMonth: `${Number(day)}/${Number(month)}`,
    isToday: dateKey === todayKey,
  };
}

function getCourtLane(court: string, courts: string[]) {
  const index = courts.indexOf(court);

  return index >= 0 ? index : 0;
}

function getBlockStyle(
  startTime: string,
  endTime: string,
  court: string,
  startHour: number,
  endHour: number,
  gridHeight: number,
  courts: string[]
) {
  const gridStart = startHour * 60;
  const gridEnd = endHour * 60;
  const start = Math.max(parseTimeToMinutes(startTime), gridStart);
  const end = Math.min(parseTimeToMinutes(endTime), gridEnd);
  const lane = getCourtLane(court, courts);
  const laneWidth = 100 / courts.length;

  if (end <= start) {
    return null;
  }

  const top = ((start - gridStart) / (gridEnd - gridStart)) * gridHeight;
  const height = ((end - start) / (gridEnd - gridStart)) * gridHeight;

  return {
    top,
    height: Math.max(height, 28),
    left: `${lane * laneWidth}%`,
    width: `${laneWidth - 1}%`,
  };
}

function formatAxisHour(hour: number, locale: Locale) {
  if (locale === "en") {
    const period = hour < 12 ? "AM" : "PM";
    const display = hour % 12 === 0 ? 12 : hour % 12;

    return `${display} ${period}`;
  }

  return `${hour}:00`;
}

function HourLabels({
  locale,
  startHour,
  endHour,
  hourHeight,
}: {
  locale: Locale;
  startHour: number;
  endHour: number;
  hourHeight: number;
}) {
  const hours = [];

  for (let hour = startHour; hour < endHour; hour++) {
    hours.push(
      <div
        key={hour}
        className="relative border-t border-gray-100 text-[11px] text-gray-400 pointer-events-none"
        style={{ height: hourHeight }}
      >
        <span className="absolute -top-2.5 right-2 bg-white px-1">
          {formatAxisHour(hour, locale)}
        </span>
      </div>
    );
  }

  return <div className="relative pointer-events-none">{hours}</div>;
}

function EventModal({
  event,
  locale,
  onClose,
}: {
  event: SelectedEvent;
  locale: Locale;
  onClose: () => void;
}) {
  const t = getDictionary(locale);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isReservation = event.type === "reservation";
  const dateKey = isReservation
    ? event.data.reservation_date
    : event.data.lesson_date;
  const { full: dateLabel } = formatDateLabel(dateKey, locale);
  const timeRange = `${formatTimeLabel(
    isReservation ? event.data.start_time : event.data.start_time,
    locale
  )} – ${formatTimeLabel(
    isReservation ? event.data.end_time : event.data.end_time,
    locale
  )}`;
  const court = event.data.court;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={t.coachModalClose}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md rounded-2xl shadow-xl p-6 ${
          isReservation
            ? "bg-blue-50 border-2 border-blue-300"
            : "bg-green-50 border-2 border-green-400"
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                isReservation ? "text-blue-700" : "text-green-700"
              }`}
            >
              {isReservation ? t.coachModalReservation : t.coachModalLesson}
            </p>
            <h3
              className={`text-xl font-bold mt-1 ${
                isReservation ? "text-blue-950" : "text-green-950"
              }`}
            >
              {isReservation
                ? event.data.customer_name
                : event.data.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-white/60 hover:text-gray-800 transition"
            aria-label={t.coachModalClose}
          >
            ✕
          </button>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">{t.date}</dt>
            <dd className="font-medium text-gray-900 text-right">{dateLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">{t.time}</dt>
            <dd className="font-medium text-gray-900">{timeRange}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">{t.court}</dt>
            <dd className="font-medium text-gray-900">
              {displayCourt(court, locale)}
            </dd>
          </div>

          {isReservation && (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">{t.phone}</dt>
                <dd className="font-medium text-gray-900">{event.data.phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">{t.email}</dt>
                <dd className="font-medium text-gray-900 break-all text-right">
                  {event.data.email}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">{t.reference}</dt>
                <dd className="font-mono text-xs font-medium text-gray-900">
                  {event.data.reservation_code}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">{t.price}</dt>
                <dd className="font-semibold text-gray-900">
                  {event.data.total_price.toLocaleString()} VND
                </dd>
              </div>
            </>
          )}

          {!isReservation && event.data.series_id && (
            <div className="rounded-lg bg-green-100/80 px-3 py-2 text-green-800">
              {t.coachModalWeekly}
            </div>
          )}

          {!isReservation && event.data.notes && (
            <div>
              <dt className="text-gray-600 mb-1">{t.coachModalNotes}</dt>
              <dd className="font-medium text-gray-900 rounded-lg bg-white/60 px-3 py-2">
                {event.data.notes}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex gap-3">
          {!isReservation && (
            <form action={deleteLesson} className="flex-1">
              <input type="hidden" name="id" value={event.data.id} />
              <button
                type="submit"
                className="w-full rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                {t.coachModalDeleteLesson}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isReservation
                ? "flex-1 border border-blue-300 bg-white text-blue-800 hover:bg-blue-100"
                : "border border-green-300 bg-white text-green-800 hover:bg-green-100"
            }`}
          >
            {t.coachModalClose}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleCalendarGrid({
  locale,
  dates,
  todayKey,
  reservationsByDate,
  lessonsByDate,
  startHour,
  endHour,
  hourHeight,
  gridHeight,
  courts,
}: Props) {
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null
  );

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <div className="min-w-[960px]">
          <div className="flex border-b border-gray-200 bg-stone-50">
            <div
              className="shrink-0 border-r border-gray-200"
              style={{ width: 56 }}
            />
            {dates.map((dateKey) => {
              const { weekday, dayMonth, isToday } = formatDayHeader(
                dateKey,
                todayKey,
                locale
              );

              return (
                <div
                  key={dateKey}
                  className={`min-w-[108px] flex-1 border-r border-gray-200 px-2 py-3 text-center last:border-r-0 ${
                    isToday ? "bg-green-50" : ""
                  }`}
                >
                  <p
                    className={`text-[11px] font-medium uppercase tracking-wide ${
                      isToday ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {weekday}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isToday ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {dayMonth}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex">
            <div
              className="shrink-0 border-r border-gray-200 bg-stone-50"
              style={{ width: 56, height: gridHeight }}
            >
              <HourLabels
                locale={locale}
                startHour={startHour}
                endHour={endHour}
                hourHeight={hourHeight}
              />
            </div>

            {dates.map((dateKey) => {
              const dayReservations = reservationsByDate[dateKey] ?? [];
              const dayLessons = lessonsByDate[dateKey] ?? [];
              const { isToday } = formatDayHeader(dateKey, todayKey, locale);

              return (
                <div
                  key={dateKey}
                  className={`relative min-w-[108px] flex-1 border-r border-gray-200 last:border-r-0 ${
                    isToday ? "bg-green-50/40" : "bg-white"
                  }`}
                  style={{ height: gridHeight }}
                >
                  {Array.from({ length: endHour - startHour }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-100 pointer-events-none"
                        style={{ height: hourHeight }}
                      />
                    )
                  )}

                  {dayReservations.map((reservation) => {
                    const style = getBlockStyle(
                      reservation.start_time,
                      reservation.end_time,
                      reservation.court,
                      startHour,
                      endHour,
                      gridHeight,
                      courts
                    );

                    if (!style) return null;

                    return (
                      <button
                        key={reservation.reservation_code}
                        type="button"
                        onClick={() =>
                          setSelectedEvent({
                            type: "reservation",
                            data: reservation,
                          })
                        }
                        className="absolute z-10 overflow-hidden rounded-md border border-blue-400 bg-blue-100 px-1 py-0.5 text-[10px] leading-tight text-blue-950 shadow-sm cursor-pointer hover:brightness-95 hover:ring-2 hover:ring-blue-300 transition text-left"
                        style={style}
                      >
                        <p className="font-semibold truncate">
                          {reservation.customer_name}
                        </p>
                        <p className="truncate opacity-80">
                          {shortCourtLabel(reservation.court, locale)}
                        </p>
                        <p className="truncate opacity-80">
                          {formatTimeLabel(reservation.start_time, locale)}–
                          {formatTimeLabel(reservation.end_time, locale)}
                        </p>
                      </button>
                    );
                  })}

                  {dayLessons.map((lesson) => {
                    const style = getBlockStyle(
                      lesson.start_time,
                      lesson.end_time,
                      lesson.court,
                      startHour,
                      endHour,
                      gridHeight,
                      courts
                    );

                    if (!style) return null;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() =>
                          setSelectedEvent({ type: "lesson", data: lesson })
                        }
                        className="absolute z-20 overflow-hidden rounded-md border border-green-600 bg-green-100 px-1 py-0.5 text-[10px] leading-tight text-green-950 shadow-sm cursor-pointer hover:brightness-95 hover:ring-2 hover:ring-green-400 transition text-left"
                        style={style}
                      >
                        <p className="font-semibold truncate">
                          {lesson.title}
                          {lesson.series_id && (
                            <span className="ml-0.5 opacity-70">↻</span>
                          )}
                        </p>
                        <p className="truncate opacity-80">
                          {shortCourtLabel(lesson.court, locale)}
                        </p>
                        <p className="truncate opacity-80">
                          {formatTimeLabel(lesson.start_time, locale)}–
                          {formatTimeLabel(lesson.end_time, locale)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          locale={locale}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
