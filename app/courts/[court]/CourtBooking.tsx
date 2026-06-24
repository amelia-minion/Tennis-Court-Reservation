"use client";

import { createReservation }
  from "@/app/book/actions";
import { useMemo, useState } from "react";
import { getDictionary, displayCourt, type Locale } from "@/lib/i18n";

type Reservation = {
  reservation_date: string;
  start_time: string;
  end_time: string;
};

type Props = {
  courtName: string;
  reservations: Reservation[];
  locale?: Locale;
};

export default function CourtBooking({
  courtName,
  reservations,
  locale = "vi",
}: Props) {

const t = getDictionary(locale);

const [customerName, setCustomerName] =
  useState("");

const [phone, setPhone] =
  useState("");

const [email, setEmail] =
  useState("");

const [selectedDayOffset, setSelectedDayOffset] =
useState(0);

const [errorMessage, setErrorMessage] =
  useState<string | null>(null);

const [isSubmitting, setIsSubmitting] =
  useState(false);

async function handleReserve() {
  if (
    !customerName ||
    !phone ||
    !email
  ) {
    setErrorMessage(t.completeContact);
    return;
  }

  const formData = new FormData();

  formData.append(
    "customer_name",
    customerName
  );

  formData.append(
    "phone",
    phone
  );

  formData.append(
    "email",
    email
  );

  formData.append(
    "court",
    courtName
  );

  formData.append(
    "reservation_date",
    selectedDate.toISOString().split("T")[0]
  );

  formData.append(
    "start_time",
    selectedTime
  );

  formData.append(
    "duration_hours",
    duration
  );

  setErrorMessage(null);
  setIsSubmitting(true);

  try {
    const result = await createReservation(formData);

    // A successful reservation redirects, so reaching here with a
    // result means something went wrong.
    if (result?.error === "court_taken") {
      setErrorMessage(t.errCourtTaken);
    } else if (result?.error) {
      setErrorMessage(t.errGeneric);
    }
  } catch {
    setErrorMessage(t.errGeneric);
  } finally {
    setIsSubmitting(false);
  }
}

const selectedDate = new Date();
selectedDate.setDate(
  selectedDate.getDate() + selectedDayOffset
);
  
const selectedDateString =
  selectedDate.toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

const selectedDateKey =
  selectedDate.toISOString().split("T")[0];

const [selectedTime, setSelectedTime] =
useState("");

const [duration, setDuration] =
useState("1");

const times = [];

for (
let hour = 5;
hour < 22;
hour += 1
) {
times.push(
  `${String(hour).padStart(
    2,
    "0"
  )}:00`
);

}

function calculatePrice() {
if (!selectedTime) return 0;

let total = 0;

const [hourStr] =
  selectedTime.split(":");

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

}

const estimatedPrice =
useMemo(
() => calculatePrice(),
[selectedTime, duration]
);

function isReserved(time: string) {
  return reservations.some((reservation) => {
    const start =
      reservation.start_time.slice(0, 5);

    const end =
      reservation.end_time.slice(0, 5);

    return (
      reservation.reservation_date ===
        selectedDateKey &&
      time >= start &&
      time < end
    );
  });
}

return ( <div className="space-y-8">

  <div>
  <div className="flex gap-2 overflow-auto">
  {Array.from({ length: 7 }).map(
    (_, offset) => {
      const labelDate = new Date();
      labelDate.setDate(
        labelDate.getDate() + offset
      );

      let label = "";

      if (offset === 0)
        label = t.today;
      else if (offset === 1)
        label = t.tomorrow;
      else {
        const dd = String(
          labelDate.getDate()
        ).padStart(2, "0");

        const mm = String(
          labelDate.getMonth() + 1
        ).padStart(2, "0");

        label = `${dd}/${mm}`;
      }

      return (
        <button
          key={offset}
          onClick={() => {
            setSelectedDayOffset(offset);
            setSelectedTime("");
          }}
          className={`px-4 py-2 rounded-lg border font-medium transition ${
            selectedDayOffset === offset
              ? "bg-green-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {label}
        </button>
      );
    }
  )}
</div>
    <h2 className="text-2xl font-semibold text-gray-400 mb-4">
      {t.availableStartTimes}
    </h2>

    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
    {times.map((time) => {
  const reserved =
    isReserved(time);

  return (
    <button
      key={time}
      disabled={reserved}
      onClick={() => {
        setSelectedTime(time);
        setErrorMessage(null);
      }}
      className={`rounded-xl p-3 border font-medium transition ${
        reserved
          ? "bg-red-100 text-red-500 border-red-200 cursor-not-allowed"
          : selectedTime === time
          ? "bg-green-700 text-white"
          : "bg-white border-gray-300 text-gray-900 hover:bg-green-50"
      }`}
    >
      {reserved ? t.reserved : time}
    </button>
  );
})}
    </div>
  </div>




  <div>
        <h2 className="text-2xl text-gray-400 font-semibold mb-4">
          {t.duration}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "1",
            "2",
            "3",
            "4",
          ].map((value) => (
            <button
              key={value}
              onClick={() =>
                setDuration(value)
              }
              className={`rounded-xl p-3 border font-medium transition ${
                duration === value
                  ? "bg-green-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {value} {t.hour}
            </button>
          ))}
        </div>
      </div>
  {selectedTime && (
    <>
<div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
  <h3 className="text-lg font-semibold text-green-800 mb-4">
    {t.selectedBooking}
  </h3>

  <div className="space-y-2 text-gray-700">
    <div className="flex justify-between">
      <span>{t.court}</span>
      <span className="font-medium">
        {displayCourt(courtName, locale)}
      </span>
    </div>

    <div className="flex justify-between">
      <span>{t.date}</span>
      <span className="font-medium">
        {selectedDateString}
      </span>
    </div>

    <div className="flex justify-between">
      <span>{t.startTime}</span>
      <span className="font-medium">
        {selectedTime}
      </span>
    </div>

    <div className="flex justify-between">
      <span>{t.duration}</span>
      <span className="font-medium">
        {duration} {t.hour}
      </span>
    </div>
  </div>

  <div className="border-t mt-4 pt-4">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-gray-800">
        {t.estimatedPrice}
      </span>

      <span className="text-2xl font-bold text-green-800">
        {estimatedPrice.toLocaleString()} VND
      </span>
    </div>
  </div>
</div>

      <div className="space-y-4">
  <h2 className="text-2xl text-gray-400 font-semibold">
    {t.contactInformation}
  </h2>

  <input
  value={customerName}
  onChange={(e) =>
    setCustomerName(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder={t.fullName}
  />

  <input
   value={phone}
   onChange={(e) =>
    setPhone(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder={t.phoneNumber}
  />

<input
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder={t.emailAddress}
  />

{errorMessage && (
  <div
    role="alert"
    className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
  >
    {errorMessage}
  </div>
)}

<button
  type="button"
  onClick={handleReserve}
  disabled={isSubmitting}
  className="
    w-full
    bg-green-700
    hover:bg-green-800
    disabled:opacity-60
    disabled:cursor-not-allowed
    text-white
    font-semibold
    py-3
    rounded-xl
    transition
  "
>
  {isSubmitting ? t.booking : t.reserveCourt}
</button>
</div>
    </>
  )}

</div>

);
}