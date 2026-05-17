"use client";

import React from "react";

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
  if (totalPages <= 1) return null;

  // Construye la lista de páginas a mostrar: siempre 1 y total,
  // current y vecinos, y "..." para gaps.
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);

  const window = 1; // cuántos vecinos a cada lado de la actual
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
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Paginación">
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        aria-label="Página anterior"
      >
        ← Anterior
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
        aria-label="Página siguiente"
      >
        Siguiente →
      </button>
    </nav>
  );
}
