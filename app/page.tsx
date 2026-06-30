import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";
import { HomeBackground } from "./HomeBackground";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="relative min-h-screen flex flex-col px-4">
      <HomeBackground />

      <Link
        href="/introduction"
        className="fixed top-4 left-4 z-50 rounded-full border border-green-700 bg-green-700 text-white shadow-sm px-4 py-1.5 text-sm font-semibold transition hover:bg-green-800 hover:border-green-800"
      >
        {t.courtIntroduction}
      </Link>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-900 mb-4 drop-shadow-sm">
            {t.homeTitle}
          </h1>

          <p className="text-gray-700 text-lg mb-8 max-w-xl mx-auto drop-shadow-sm">
            {t.homeSubtitle}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/courts"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md"
            >
              {t.viewCourts}
            </Link>

            <Link
              href="/pricing"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md"
            >
              {t.viewRates}
            </Link>
          </div>
        </div>
      </div>

      <footer className="relative z-10 pb-6 text-center">
        <Link
          href="/coach/login"
          className="text-xs text-gray-500 hover:text-gray-700 transition"
        >
          {t.coachLoginLink}
        </Link>
      </footer>
    </main>
  );
}
