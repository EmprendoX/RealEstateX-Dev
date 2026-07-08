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
    // Notify other components in the same tab (the storage event doesn't fire locally)
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // localStorage full or blocked — silence it; the favorite won't persist.
  }
}

/**
 * Shared hook for favorites (localStorage).
 * SSR-safe: on the server it returns [] and hydrates on mount.
 *
 * Multiple instances of the hook on the same page stay in sync
 * via a CustomEvent — useful so the heart on the card and the navbar
 * counter react to a tap without the user having to reload.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFromStorage());
    setHydrated(true);

    const sync = () => setFavorites(readFromStorage());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync); // syncs across tabs

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
