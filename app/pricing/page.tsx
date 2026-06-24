import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDictionary, type Dictionary } from "@/lib/i18n";

function pricingTiers(t: Dictionary) {
  return [
    { hours: "5:00 AM – 6:00 AM", rate: 300000, label: t.tierEarlyMorning },
    { hours: "6:00 AM – 9:00 AM", rate: 200000, label: t.tierMorning },
    { hours: "9:00 AM – 10:00 AM", rate: 180000, label: t.tierLateMorning },
    { hours: "10:00 AM – 3:00 PM", rate: 120000, label: t.tierDaytime },
    { hours: "3:00 PM – 4:00 PM", rate: 180000, label: t.tierAfternoon },
    { hours: "4:00 PM – 5:00 PM", rate: 200000, label: t.tierLateAfternoon },
    { hours: "5:00 PM – 10:00 PM", rate: 320000, label: t.tierEveningPeak },
  ];
}

export default async function PricingPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const tiers = pricingTiers(t);

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {t.courtPricing}
          </h1>

          <p className="text-gray-600 text-lg">{t.pricingSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 bg-green-800 text-white font-semibold">
            <span>{t.timeSlot}</span>
            <span>{t.hourlyRate}</span>
          </div>

          <ul className="divide-y divide-gray-100">
            {tiers.map((tier) => (
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

        <p className="text-center text-gray-500 mt-8">{t.pricingNote}</p>

        <div className="flex justify-center gap-6 mt-6">
          <Link
            href="/courts"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {t.viewCourts}
          </Link>

          <Link href="/" className="text-green-700 hover:underline py-3">
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
