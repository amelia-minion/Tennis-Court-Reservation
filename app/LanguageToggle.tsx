"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;

    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  }

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "vi", label: "VI" },
  ];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden ${
        isPending ? "opacity-70" : ""
      }`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => switchTo(option.value)}
          aria-pressed={locale === option.value}
          className={`px-3 py-1.5 text-sm font-semibold transition ${
            locale === option.value
              ? "bg-green-700 text-white"
              : "text-gray-600 hover:bg-green-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
