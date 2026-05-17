"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "realestatex:favorites";
const EVENT_NAME = "realestatex:favorites:change";

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Notificar a otros componentes en la misma pestaña (storage event no se dispara local)
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // localStorage lleno o bloqueado — silenciar; el favorito no persiste.
  }
}

/**
 * Hook compartido para favoritos (localStorage).
 * SSR-safe: en el servidor devuelve [] y se hidrata al montar.
 *
 * Múltiples instancias del hook en la misma página se mantienen sincronizadas
 * via un CustomEvent — útil para que el heart en el card y el contador del
 * navbar reaccionen al toque sin que el usuario tenga que recargar.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFromStorage());
    setHydrated(true);

    const sync = () => setFavorites(readFromStorage());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync); // sincroniza entre pestañas

    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = readFromStorage();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeToStorage(next);
    setFavorites(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = readFromStorage().filter((x) => x !== id);
    writeToStorage(next);
    setFavorites(next);
  }, []);

  const clear = useCallback(() => {
    writeToStorage([]);
    setFavorites([]);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return { favorites, hydrated, toggle, remove, clear, isFavorite, count: favorites.length };
}
