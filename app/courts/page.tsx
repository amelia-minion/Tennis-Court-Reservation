import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDictionary, displayCourt } from "@/lib/i18n";

const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"];

export default async function CourtsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {t.selectCourt}
          </h1>

          <p className="text-gray-600 text-lg">
            {t.selectCourtSubtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {COURTS.map((court) => (
            <Link
            key={court}
            href={`/courts/${court.toLowerCase().replace(" ", "-")}`}
            className="
              group
              relative
              rounded-3xl
              overflow-hidden
              shadow-md
              hover:shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              bg-[#1f5d3b]
              h-[240px]
            "
          >
            {/* Outer court */}
            <div className="absolute inset-5 border-4 border-white rounded-xl" />
          
            {/* Service boxes */}
            <div className="absolute top-5 bottom-5 left-1/2 w-[4px] -translate-x-1/2 bg-white" />
          
            <div className="absolute left-5 right-5 top-1/2 h-[4px] -translate-y-1/2 bg-white" />
          
            <div className="absolute left-[25%] top-5 bottom-5 w-[4px] bg-white/80" />
          
            <div className="absolute right-[25%] top-5 bottom-5 w-[4px] bg-white/80" />
          
            {/* Net */}
            <div className="absolute left-5 right-5 top-1/2 h-[6px] -translate-y-1/2 bg-black/25" />
          
            {/* Court label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-2xl">
                <h2 className="text-3xl font-bold text-green-900">
                  {displayCourt(court, locale)}
                </h2>
          
                <p className="text-sm text-gray-500 text-center">
                  {t.viewSchedule}
                </p>
              </div>
            </div>
          </Link>
          ))}
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