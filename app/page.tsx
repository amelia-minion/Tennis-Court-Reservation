import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col px-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {t.homeTitle}
          </h1>

          <p className="text-gray-600 text-lg mb-8">{t.homeSubtitle}</p>

          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/courts"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {t.viewCourts}
            </Link>

            <Link
              href="/pricing"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {t.viewRates}
            </Link>
          </div>
        </div>
      </div>

      <footer className="pb-6 text-center">
        <Link
          href="/coach/login"
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          {t.coachLoginLink}
        </Link>
      </footer>
    </main>
  );
}
