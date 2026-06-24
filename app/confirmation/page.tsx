import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getLocale } from "@/lib/locale";
import { getDictionary, displayCourt } from "@/lib/i18n";

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

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);

  if (!code) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <p className="text-gray-600">{t.noReservation}</p>
      </main>
    );
  }

  const { data: reservation } = await supabase
    .from("reservations")
    .select("*")
    .eq("reservation_code", code)
    .single();

  if (!reservation) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <p className="text-gray-600">{t.reservationNotFound}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            {t.reservationConfirmed}
          </h1>

          <p className="text-gray-600">{t.bookedSuccess}</p>
        </div>

        <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-8 space-y-2">
          <p>
            <strong>{t.reference}:</strong> {reservation.reservation_code}
          </p>

          <p>
            <strong>{t.name}:</strong> {reservation.customer_name}
          </p>

          <p>
            <strong>{t.phone}:</strong> {reservation.phone}
          </p>

          <p>
            <strong>{t.email}:</strong> {reservation.email}
          </p>

          <p>
            <strong>{t.court}:</strong>{" "}
            {displayCourt(reservation.court, locale)}
          </p>

          <p>
            <strong>{t.date}:</strong>{" "}
            {new Date(reservation.reservation_date).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>

          <p>
            <strong>{t.time}:</strong> {formatTime(reservation.start_time)} –{" "}
            {formatTime(reservation.end_time)}
          </p>

          <p>
            <strong>{t.price}:</strong>{" "}
            {reservation.total_price.toLocaleString()} VND
          </p>

          <p className="pt-4 text-gray-600">{t.paymentAtCourt}</p>
        </div>

        <p className="text-center mt-8">
          <Link href="/" className="text-green-700 hover:underline">
            {t.backHome}
          </Link>
        </p>
      </div>
    </main>
  );
}
