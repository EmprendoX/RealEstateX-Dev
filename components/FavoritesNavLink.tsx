"use client";

import React from "react";
import Link from "next/link";
import { useFavorites } from "@/utils/useFavorites";

interface FavoritesNavLinkProps {
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

export default function FavoritesNavLink({
  onClick,
  variant = "desktop",
}: FavoritesNavLinkProps) {
  const { count, hydrated } = useFavorites();
  const showBadge = hydrated && count > 0;

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
        onClick={onClick}
        className="text-gray-700 hover:text-primary transition-colors font-medium px-2 flex items-center gap-2"
      >
        <span>Favoritos</span>
        {showBadge && (
          <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/favorites"
      onClick={onClick}
      aria-label={`Favoritos${showBadge ? ` (${count})` : ""}`}
      className="relative text-gray-700 hover:text-primary transition-colors p-2"
    >
      <svg
        className="w-6 h-6"
        fill={showBadge ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showBadge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
