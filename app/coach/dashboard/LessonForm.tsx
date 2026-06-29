import Link from "next/link";
import {
  displayCourt,
  getDictionary,
  type Locale,
} from "@/lib/i18n";
import type { LessonFlash } from "@/lib/coach-lessons";

const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"];

const inputClassName =
  "w-full border border-gray-300 rounded-xl p-3 text-gray-600 placeholder:text-gray-600";

type Props = {
  locale: Locale;
  today: string;
  maxDate: string;
  flash: LessonFlash | null;
};

export default function LessonForm({ locale, today, maxDate, flash }: Props) {
  const t = getDictionary(locale);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        {t.coachScheduleLesson}
      </h2>

      {flash?.error && flash.message && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
        >
          {flash.message}
          {flash.error === "unauthorized" && (
            <p className="mt-2">
              <Link href="/coach/login" className="font-medium underline">
                {t.coachLoginLink}
              </Link>
            </p>
          )}
        </div>
      )}

      {flash?.success && flash.message && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-700"
        >
          {flash.message}
        </div>
      )}

      <form
        action="/coach/dashboard/schedule"
        method="POST"
        className="grid gap-4 md:grid-cols-2"
      >
        <input
          name="title"
          type="text"
          placeholder={t.coachLessonTitlePlaceholder}
          className={`md:col-span-2 ${inputClassName}`}
          required
        />

        <select name="court" className={inputClassName} required>
          <option value="" className="text-gray-600">
            {t.coachSelectCourt}
          </option>
          {COURTS.map((court) => (
            <option key={court} value={court} className="text-gray-600">
              {displayCourt(court, locale)}
            </option>
          ))}
        </select>

        <input
          name="lesson_date"
          type="date"
          min={today}
          max={maxDate}
          className={inputClassName}
          required
        />

        <input
          name="start_time"
          type="time"
          className={inputClassName}
          required
        />

        <select name="duration_hours" className={inputClassName} required>
          <option value="1" className="text-gray-600">
            {t.coachDuration1Hour}
          </option>
          <option value="2" className="text-gray-600">
            {t.coachDuration2Hours}
          </option>
          <option value="3" className="text-gray-600">
            {t.coachDuration3Hours}
          </option>
        </select>

        <fieldset className="md:col-span-2 rounded-xl border border-gray-200 p-4">
          <legend className="px-1 text-sm font-medium text-gray-700">
            {t.coachRepeatWeekly}
          </legend>
          <div className="mt-2 flex gap-6">
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="repeat_weekly"
                value="no"
                defaultChecked
                className="text-green-700"
              />
              {t.coachRepeatNo}
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="repeat_weekly"
                value="yes"
                className="text-green-700"
              />
              {t.coachRepeatYes}
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {t.coachRepeatWeeklyHint}
          </p>
        </fieldset>

        <textarea
          name="notes"
          placeholder={t.coachNotesPlaceholder}
          rows={2}
          className={`md:col-span-2 ${inputClassName}`}
        />

        <button
          type="submit"
          className="md:col-span-2 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
        >
          {t.coachScheduleButton}
        </button>
      </form>
    </div>
  );
}
