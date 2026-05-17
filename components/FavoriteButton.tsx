"use client";

import React from "react";
import { useFavorites } from "@/utils/useFavorites";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({
  propertyId,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = isFavorite(propertyId);

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      type="button"
      onClick={(e) => {
        // Si el botón está dentro de un <Link>, evitar navegar al togglear
        e.preventDefault();
        e.stopPropagation();
        toggle(propertyId);
      }}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
      // suppressHydrationWarning: el estado inicial (server) es siempre "no favorito"
      // y se hidrata en el cliente. Es deseado y no representa un error real.
      suppressHydrationWarning
      className={`${btnSize} rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 ${className}`}
    >
      <svg
        className={`${iconSize} transition-colors ${
          hydrated && active ? "text-red-500" : "text-gray-600"
        }`}
        fill={hydrated && active ? "currentColor" : "none"}
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
    </button>
  );
}
