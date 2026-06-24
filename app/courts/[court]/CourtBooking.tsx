"use client";

import { createReservation }
  from "@/app/book/actions";
import { useMemo, useState } from "react";

type Reservation = {
  reservation_date: string;
  start_time: string;
  end_time: string;
};

type Props = {
  courtName: string;
  reservations: Reservation[];
};

export default function CourtBooking({
  courtName,
  reservations,
}: Props) {

const [customerName, setCustomerName] =
  useState("");

const [phone, setPhone] =
  useState("");

const [email, setEmail] =
  useState("");

const [selectedDayOffset, setSelectedDayOffset] =
useState(0);

async function handleReserve() {
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

  if (
    !customerName ||
    !phone ||
    !email
  ) {
    alert(
      "Please complete all contact information."
    );
    return;
  }
  await createReservation(formData);
}

const selectedDate = new Date();
selectedDate.setDate(
  selectedDate.getDate() + selectedDayOffset
);
  
const selectedDateString =
  selectedDate.toLocaleDateString(
    "en-US",
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
hour += 0.5
) {
const h = Math.floor(hour);
const m =
hour % 1 === 0 ? "00" : "30";

times.push(
  `${String(h).padStart(
    2,
    "0"
  )}:${m}`
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
    hourlyRate = 180000;
  } else if (
    currentHour >= 9 &&
    currentHour < 15
  ) {
    hourlyRate = 100000;
  } else if (
    currentHour >= 15 &&
    currentHour < 17
  ) {
    hourlyRate = 180000;
  } else if (
    currentHour >= 17 &&
    currentHour < 21
  ) {
    hourlyRate = 300000;
  } else if (
    currentHour >= 21 &&
    currentHour < 22
  ) {
    hourlyRate = 240000;
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
      let label = "";

      if (offset === 0)
        label = "Today";
      else if (offset === 1)
        label = "Tomorrow";
      else label = `+${offset} Days`;

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
      Available Start Times
    </h2>

    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
    {times.map((time) => {
  const reserved =
    isReserved(time);

  return (
    <button
      key={time}
      disabled={reserved}
      onClick={() =>
        setSelectedTime(time)
      }
      className={`rounded-xl p-3 border font-medium transition ${
        reserved
          ? "bg-red-100 text-red-500 border-red-200 cursor-not-allowed"
          : selectedTime === time
          ? "bg-green-700 text-white"
          : "bg-white border-gray-300 text-gray-900 hover:bg-green-50"
      }`}
    >
      {reserved ? "Reserved" : time}
    </button>
  );
})}
    </div>
  </div>




  <div>
        <h2 className="text-2xl text-gray-400 font-semibold mb-4">
          Duration
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "1",
            "1.5",
            "2",
            "2.5",
            "3",
            "3.5",
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
              {value} Hour
            </button>
          ))}
        </div>
      </div>
  {selectedTime && (
    <>
<div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
  <h3 className="text-lg font-semibold text-green-800 mb-4">
    Selected Booking
  </h3>

  <div className="space-y-2 text-gray-700">
    <div className="flex justify-between">
      <span>Court</span>
      <span className="font-medium">
        {courtName}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Date</span>
      <span className="font-medium">
        {selectedDateString}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Start Time</span>
      <span className="font-medium">
        {selectedTime}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Duration</span>
      <span className="font-medium">
        {duration} Hour
      </span>
    </div>
  </div>

  <div className="border-t mt-4 pt-4">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-gray-800">
        Estimated Price
      </span>

      <span className="text-2xl font-bold text-green-800">
        {estimatedPrice.toLocaleString()} VND
      </span>
    </div>
  </div>
</div>

      <div className="space-y-4">
  <h2 className="text-2xl text-gray-400 font-semibold">
    Contact Information
  </h2>

  <input
  value={customerName}
  onChange={(e) =>
    setCustomerName(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder="Full Name"
  />

  <input
   value={phone}
   onChange={(e) =>
    setPhone(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder="Phone Number"
  />

<input
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  className="w-full border border-gray-300 text-gray-500 rounded-xl p-3"
  placeholder="Email Adress"
  />

<button
  type="button"
  onClick={handleReserve}
  className="
    w-full
    bg-green-700
    hover:bg-green-800
    text-white
    font-semibold
    py-3
    rounded-xl
    transition
  "
>
  Reserve Court
</button>
</div>
    </>
  )}

</div>

);
}