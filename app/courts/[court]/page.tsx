import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { getDictionary, displayCourt } from "@/lib/i18n";
import { fetchCourtBlocks, getTodayKey, getWindowEndKey, CUSTOMER_BOOKING_DAYS_AHEAD } from "@/lib/scheduling";
import CourtBooking from "./CourtBooking";

const COURT_BY_SLUG: Record<string, string> = {
  "court-1": "Court 1",
  "court-2": "Court 2",
  "court-3": "Court 3",
  "court-4": "Court 4",
};

type Props = {
  params: Promise<{ court: string }>;
};

export default async function CourtPage({ params }: Props) {
  const { court: slug } = await params;
  const courtName = COURT_BY_SLUG[slug];

  if (!courtName) {
    notFound();
  }

  const locale = await getLocale();
  const t = getDictionary(locale);

  const today = getTodayKey();
  const endDate = getWindowEndKey(CUSTOMER_BOOKING_DAYS_AHEAD);

  const scheduledBlocks = await fetchCourtBlocks(
    courtName,
    today,
    endDate
  );

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          {displayCourt(courtName, locale)}
        </h1>

        <p className="text-gray-600 mb-8">{t.selectStartTime}</p>

        <CourtBooking
          courtName={courtName}
          scheduledBlocks={scheduledBlocks}
          locale={locale}
        />

        <p className="text-center mt-8">
          <Link href="/courts" className="text-green-700 hover:underline">
            {t.backCourts}
          </Link>
        </p>
      </div>
    </main>
  );
}
