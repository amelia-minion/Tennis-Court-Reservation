import BookingForm from "./BookingForm";
import { createReservation } from "./actions";

type Props = {
  searchParams: Promise<{
    court?: string;
  }>;
};

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;

  const selectedCourt = params.court ?? "Court 1";

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Reserve a Court
          </h1>

          <p className="text-gray-600 text-lg">
            Choose your time and review the price before booking.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form action={createReservation} className="space-y-4">
            <BookingForm selectedCourt={selectedCourt} />

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition"
            >
              Reserve Court
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Payment will be collected at the court.
        </p>
      </div>
    </main>
  );
}
