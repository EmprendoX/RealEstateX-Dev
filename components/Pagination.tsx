"use client";

import React from "react";
import { useTranslation } from "next-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation("common");
  if (totalPages <= 1) return null;

  // Builds the list of pages to show: always 1 and total,
  // current and neighbors, and "..." for gaps.
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);

  const window = 1; // how many neighbors on each side of the current page
  const showFirst = 1;
  const showLast = totalPages;

  for (let p = 1; p <= totalPages; p++) {
    if (
      p === showFirst ||
      p === showLast ||
      (p >= currentPage - window && p <= currentPage + window)
    ) {
      add(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      add("ellipsis");
    }
  }

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label={t("pagination.label")}>
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        aria-label={t("pagination.previousLabel")}
      >
        {t("pagination.previous")}
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={
              p === currentPage
                ? "min-w-[40px] px-3 py-2 rounded-md bg-primary text-white text-sm font-semibold"
                : "min-w-[40px] px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm"
            }
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        aria-label={t("pagination.nextLabel")}
      >
        {t("pagination.next")}
      </button>
    </nav>
  );
}
