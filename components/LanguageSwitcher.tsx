"use client";

import React from "react";
import { useRouter } from "next/router";

interface LanguageSwitcherProps {
  invert?: boolean;
}

/**
 * Language toggle (es <-> en). Preserves route + query; next-i18next
 * persists the choice via cookie.
 */
export default function LanguageSwitcher({ invert = false }: LanguageSwitcherProps) {
  const router = useRouter();
  const { pathname, asPath, query, locale, locales } = router;

  const switchTo = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  const available = (locales ?? ["es", "en"]).filter((l) => l !== "default");

  return (
    <div className="flex items-center gap-1">
      {available.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && (
            <span className={`text-xs ${invert ? "text-white/30" : "text-ink/30"}`}>/</span>
          )}
          <button
            onClick={() => switchTo(l)}
            aria-label={`Switch language to ${l}`}
            className={`text-xs uppercase tracking-eyebrow transition-colors ${
              locale === l
                ? invert ? "text-white" : "text-ink"
                : invert ? "text-white/50 hover:text-white" : "text-ink/50 hover:text-ink"
            }`}
          >
            {l}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
