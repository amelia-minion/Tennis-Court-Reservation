import {
  displayCourt,
  getDictionary,
  type Locale,
} from "@/lib/i18n";
import {
  COACH_SCHEDULING_DAYS_AHEAD,
  formatDateKey,
  getTodayKey,
  getWindowEndKey,
} from "@/lib/scheduling";
import ScheduleCalendarGrid from "./ScheduleCalendarGrid";

type Reservation = {
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

type Lesson = {
  id: string;
  title: string;
  court: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  series_id: string | null;
};

type Props = {
  locale: Locale;
  reservations: Reservation[];
  lessons: Lesson[];
  lessonsError: boolean;
  formToken: string;
};

const START_HOUR = 5;
const END_HOUR = 22;
const HOUR_HEIGHT = 52;
const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"];

const GRID_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

function buildCalendarDates() {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let i = 0; i <= COACH_SCHEDULING_DAYS_AHEAD; i++) {
    dates.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export default function ScheduleCalendar({
  locale,
  reservations,
  lessons,
  lessonsError,
  formToken,
}: Props) {
  const t = getDictionary(locale);
  const todayKey = getTodayKey();
  const endKey = getWindowEndKey(COACH_SCHEDULING_DAYS_AHEAD);
  const dates = buildCalendarDates();

  const reservationsByDate = reservations.reduce<
    Record<string, Reservation[]>
  >((acc, reservation) => {
    acc[reservation.reservation_date] ??= [];
    acc[reservation.reservation_date].push(reservation);
    return acc;
  }, {});

  const lessonsByDate = lessons.reduce<Record<string, Lesson[]>>(
    (acc, lesson) => {
      acc[lesson.lesson_date] ??= [];
      acc[lesson.lesson_date].push(lesson);
      return acc;
    },
    {}
  );

  const totalEvents = reservations.length + lessons.length;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-green-800">
            {t.coachCalendarTitle}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {t.coachCalendarSubtitle
              .replace("{start}", todayKey)
              .replace("{end}", endKey)}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-blue-200 border border-blue-400" />
            {t.coachLegendReservation}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-green-200 border border-green-500" />
            {t.coachLegendLesson}
          </span>
        </div>
      </div>

      {lessonsError && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {t.coachLessonsTableMissing}
        </p>
      )}

      {totalEvents === 0 && !lessonsError && (
        <p className="mb-4 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
          {t.coachNoEvents}
        </p>
      )}

      <ScheduleCalendarGrid
        locale={locale}
        dates={dates}
        todayKey={todayKey}
        reservationsByDate={reservationsByDate}
        lessonsByDate={lessonsByDate}
        startHour={START_HOUR}
        endHour={END_HOUR}
        hourHeight={HOUR_HEIGHT}
        gridHeight={GRID_HEIGHT}
        courts={COURTS}
        formToken={formToken}
      />

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-500">
        {COURTS.map((court, index) => (
          <span key={court}>
            {t.coachLane
              .replace("{lane}", String(index + 1))
              .replace("{court}", displayCourt(court, locale))}
          </span>
        ))}
      </div>
    </section>
  );
}
