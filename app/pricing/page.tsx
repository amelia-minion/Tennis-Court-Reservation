import Link from "next/link";

const PRICING_TIERS = [
  {
    hours: "5:00 AM – 6:00 AM",
    rate: 300000,
    label: "Early morning",
  },
  {
    hours: "6:00 AM – 9:00 AM",
    rate: 180000,
    label: "Morning",
  },
  {
    hours: "9:00 AM – 3:00 PM",
    rate: 100000,
    label: "Daytime",
  },
  {
    hours: "3:00 PM – 5:00 PM",
    rate: 180000,
    label: "Afternoon",
  },
  {
    hours: "5:00 PM – 9:00 PM",
    rate: 300000,
    label: "Evening peak",
  },
  {
    hours: "9:00 PM – 10:00 PM",
    rate: 240000,
    label: "Late evening",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Court Pricing
          </h1>

          <p className="text-gray-600 text-lg">
            Rates vary by time of day. Bookings are billed in 30-minute
            increments.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 bg-green-800 text-white font-semibold">
            <span>Time Slot</span>
            <span>Hourly Rate</span>
          </div>

          <ul className="divide-y divide-gray-100">
            {PRICING_TIERS.map((tier) => (
              <li
                key={tier.hours}
                className="grid grid-cols-[1fr_auto] gap-4 px-6 py-5 items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{tier.hours}</p>
                  <p className="text-sm text-gray-500">{tier.label}</p>
                </div>

                <p className="text-lg font-bold text-green-800 whitespace-nowrap">
                  {tier.rate.toLocaleString()} VND
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-gray-500 mt-8">
          Payment is collected at the court after your reservation is
          confirmed.
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <Link
            href="/courts"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            View Courts
          </Link>

          <Link href="/" className="text-green-700 hover:underline py-3">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
