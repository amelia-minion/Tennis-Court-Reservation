import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { ensureGuestCoach, loginCoach } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CoachLoginPage({ searchParams }: Props) {
  await ensureGuestCoach();
  const { error } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2 leading-tight">
            {t.coachLoginTitle}
          </h1>
          <p className="text-gray-600">{t.coachLoginSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error === "invalid" && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
            >
              {t.coachLoginInvalid}
            </div>
          )}

          <form action={loginCoach} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.coachEmail}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="coach@example.com"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.coachPassword}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t.coachPasswordPlaceholder}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
            >
              {t.coachLoginButton}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-green-700 hover:underline">
            {t.coachBackToSite}
          </Link>
        </p>
      </div>
    </main>
  );
}
