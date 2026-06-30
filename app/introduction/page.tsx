import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";
import { COURT_MAP_EMBED_URL, COURT_MAP_URL } from "@/lib/court-info";
import { PhotoGallery } from "./PhotoGallery";

export default async function IntroductionPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  const details = [
    { label: t.introCourtName, value: t.introCourtNameValue },
    { label: t.introAddress, value: t.introAddressValue },
    {
      label: t.introPhone,
      value: t.introPhoneValue,
      href: `tel:${t.introPhoneValue}`,
    },
    { label: t.introHours, value: t.introHoursValue },
  ];

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {t.introTitle}
          </h1>
          <p className="text-gray-600 text-lg">{t.introSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {details.map((item) => (
              <li key={item.label} className="px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-green-800">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 block text-lg text-gray-900 hover:text-green-700 transition"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-lg text-gray-900">{item.value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-800 text-white font-semibold">
            {t.introMapTitle}
          </div>
          <div className="p-6">
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <iframe
                title={t.introMapTitle}
                src={COURT_MAP_EMBED_URL}
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-center text-sm text-gray-500">
              {t.introAddressValue}
            </p>
            <div className="mt-4 flex justify-center">
              <a
                href={COURT_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
              >
                {t.introMapOpen}
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-800 text-white font-semibold">
            {t.introPhotosTitle}
          </div>
          <PhotoGallery locale={locale} />
        </section>

        <div className="flex justify-center mt-8">
          <Link
            href="/"
            className="text-green-700 hover:underline py-3 font-medium"
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
