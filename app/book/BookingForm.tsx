"use client";

import { useMemo, useState } from "react";
import { getDictionary, displayCourt, type Locale } from "@/lib/i18n";

type Props = {
  selectedCourt: string;
  selectedDate?: string;
  selectedStartTime?: string;
  hideScheduleFields?: boolean;
  locale?: Locale;
};

export default function BookingForm({
  selectedCourt,
  selectedDate = "",
  selectedStartTime = "09:00",
  hideScheduleFields = false,
  locale = "vi",
}: Props) {
  const t = getDictionary(locale);
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(selectedStartTime);

  const [duration, setDuration] =
    useState("1");

  const calculatePrice = () => {
    let total = 0;

    const [hourStr] =
      startTime.split(":");

    const startHour =
      Number(hourStr);

    const halfHours =
      Number(duration) * 2;

    for (
      let i = 0;
      i < halfHours;
      i++
    ) {
      const currentHour =
        startHour + i * 0.5;

      let hourlyRate = 0;

      if (
        currentHour >= 5 &&
        currentHour < 6
      ) {
        hourlyRate = 300000;
      } else if (
        currentHour >= 6 &&
        currentHour < 9
      ) {
        hourlyRate = 200000;
      } else if (
        currentHour >= 9 &&
        currentHour < 10
      ) {
        hourlyRate = 180000;
      } else if (
        currentHour >= 10 &&
        currentHour < 15
      ) {
        hourlyRate = 120000;
      } else if (
        currentHour >= 15 &&
        currentHour < 16
      ) {
        hourlyRate = 180000;
      } else if (
        currentHour >= 16 &&
        currentHour < 17
      ) {
        hourlyRate = 200000;
      } else if (
        currentHour >= 17 &&
        currentHour < 22
      ) {
        hourlyRate = 320000;
      }

      total += hourlyRate / 2;
    }

    return total;
  };

  const estimatedPrice =
    useMemo(
      () => calculatePrice(),
      [startTime, duration]
    );

  return (
    <>
      <input
        type="hidden"
        name="court"
        value={selectedCourt}
      />

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-gray-600">
          {t.selectedCourt}
        </p>

        <p className="text-xl font-bold text-green-800">
          {displayCourt(selectedCourt, locale)}
        </p>
      </div>

      {!hideScheduleFields && (
        <>
          <input
            name="reservation_date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required
          />

          <input
            name="start_time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required
          />
        </>
      )}

      {hideScheduleFields && (
        <>
          <input name="reservation_date" type="hidden" value={date} />
          <input name="start_time" type="hidden" value={startTime} />
        </>
      )}

      <select
        name="duration_hours"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg"
        required
      >
        <option value="1">1 {t.hour}</option>
        <option value="2">2 {t.hours}</option>
        <option value="3">3 {t.hours}</option>
        <option value="4">4 {t.hours}</option>
      </select>

      <div className="bg-white border-2 border-green-700 rounded-xl p-5">
        <p className="text-gray-600">{t.estimatedPrice}</p>

        <p className="text-3xl font-bold text-green-800">
          {estimatedPrice.toLocaleString()} VND
        </p>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">{t.contactInformation}</h2>

        <div className="space-y-4">
          <input
            name="customer_name"
            type="text"
            placeholder={t.fullName}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder={t.phoneNumber}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required
          />

          <input
            name="email"
            type="email"
            placeholder={t.emailAddress}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required
          />
        </div>
      </div>
    </>
  );
}
