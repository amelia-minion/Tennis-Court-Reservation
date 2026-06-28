"use server";

import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { redirect } from "next/navigation";
import { findSchedulingConflicts, isDateWithinWindow, CUSTOMER_BOOKING_DAYS_AHEAD } from "@/lib/scheduling";

function calculatePrice(startTime: string, durationHours: number) {
  let total = 0;

  const [hourStr] = startTime.split(":");
  const startHour = Number(hourStr);

  const halfHours = durationHours * 2;

  for (let i = 0; i < halfHours; i++) {
    const currentHour = startHour + i * 0.5;

    let hourlyRate = 0;

    if (currentHour >= 5 && currentHour < 6) {
      hourlyRate = 300000;
    } else if (currentHour >= 6 && currentHour < 9) {
      hourlyRate = 200000;
    } else if (currentHour >= 9 && currentHour < 10) {
      hourlyRate = 180000;
    } else if (currentHour >= 10 && currentHour < 15) {
      hourlyRate = 120000;
    } else if (currentHour >= 15 && currentHour < 16) {
      hourlyRate = 180000;
    } else if (currentHour >= 16 && currentHour < 17) {
      hourlyRate = 200000;
    } else if (currentHour >= 17 && currentHour < 22) {
      hourlyRate = 320000;
    }

    total += hourlyRate / 2;
  }

  return total;
}

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

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function createReservation(formData: FormData) {
  const customer_name = formData.get("customer_name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const court = formData.get("court") as string;
  const reservation_date = formData.get("reservation_date") as string;
  const start_time = formData.get("start_time") as string;
  const duration_hours = Number(formData.get("duration_hours"));

  if (
    !isDateWithinWindow(
      reservation_date,
      CUSTOMER_BOOKING_DAYS_AHEAD
    )
  ) {
    return { error: "outside_window" as const };
  }

  const end_time = calculateEndTime(start_time, duration_hours);

  const { reservationError, lessonError, hasConflict } =
    await findSchedulingConflicts(
      court,
      reservation_date,
      start_time,
      end_time
    );

  if (reservationError || lessonError) {
    console.error("Overlap check failed:", reservationError || lessonError);
    return { error: "generic" as const };
  }

  if (hasConflict) {
    return { error: "court_taken" as const };
  }

  const reservation_code =
    "RSV-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const total_price = calculatePrice(start_time, duration_hours);

  const { error } = await supabase.from("reservations").insert({
    reservation_code,
    customer_name,
    phone,
    email,
    court,
    reservation_date,
    start_time,
    end_time,
    duration_hours,
    total_price,
    status: "confirmed",
  });

  if (error) {
    console.error("Failed to insert reservation:", error);
    return { error: "generic" as const };
  }

  // Sender must be on a domain verified in Resend to reach real customers.
  // Until xanhtennis.com is verified, fall back to Resend's sandbox sender
  // (which only delivers to the Resend account owner's own email).
  const fromAddress =
    process.env.RESEND_FROM || "onboarding@resend.dev";
  const adminEmail =
    process.env.ADMIN_EMAIL || "sangnhvt10012@gmail.com";

  // Email to the customer.
  const { error: customerEmailError } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Tennis Court Reservation Confirmed",
    html: `
      <h2>Reservation Confirmed</h2>

      <p><strong>Reference:</strong> ${reservation_code}</p>

      <p><strong>Name:</strong> ${customer_name}</p>

      <p><strong>Court:</strong> ${court}</p>

      <p><strong>Date:</strong> ${formatDate(reservation_date)}</p>

      <p><strong>Time:</strong> ${formatTime(start_time)} - ${formatTime(end_time)}</p>

      <p><strong>Total Price:</strong>
      ${total_price.toLocaleString()}
      VND</p>

      <p>Payment will be collected at the court.</p>
    `,
  });

  if (customerEmailError) {
    console.error(
      "Failed to send customer confirmation email:",
      customerEmailError
    );
  }

  // Email to the admin.
  const { error: adminEmailError } = await resend.emails.send({
    from: fromAddress,
    to: adminEmail,
    subject: `New Reservation - ${reservation_code}`,
    html: `
      <h2>New Reservation Received</h2>

      <p><strong>Reference:</strong> ${reservation_code}</p>
      <p><strong>Name:</strong> ${customer_name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Court:</strong> ${court}</p>
      <p><strong>Date:</strong> ${formatDate(reservation_date)}</p>
      <p><strong>Time:</strong>
        ${formatTime(start_time)} - ${formatTime(end_time)}
      </p>
      <p><strong>Total Price:</strong> ${total_price.toLocaleString()} VND</p>
    `,
  });

  if (adminEmailError) {
    console.error(
      "Failed to send admin notification email:",
      adminEmailError
    );
  }

  redirect(`/confirmation?code=${reservation_code}`);
}
