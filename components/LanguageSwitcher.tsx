"use client";

import React from "react";
import { useRouter } from "next/router";

/**
 * Language switcher. Toggles the active locale (es <-> en) while keeping the
 * user on the same route. next-i18next persists the choice via cookie.
 */
export default function LanguageSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const router = useRouter();
  const { pathname, asPath, query, locale, locales } = router;

  const switchTo = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  const available = (locales ?? ["es", "en"]).filter((l) => l !== "default");

  return (
    <div className={`flex items-center gap-1 ${variant === "mobile" ? "px-2" : ""}`}>
      {available.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-label={`Switch language to ${l}`}
          className={`px-2 py-1 rounded text-sm font-medium uppercase transition-colors ${
            locale === l
              ? "bg-primary text-white"
              : "text-gray-500 hover:text-primary"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
