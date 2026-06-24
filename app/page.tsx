import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          Tennis Court Reservations
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Choose a court, view availability, and reserve your time.
        </p>

        <div className="flex justify-center gap-4 mt-6">
  <Link
    href="/courts"
    className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition"
  >
    View Courts
  </Link>

  <Link
    href="/pricing"
    className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition"
  >
    View Court Rates
  </Link>
</div>
      </div>
    </main>
  );
}