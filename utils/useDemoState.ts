import { useEffect, useState } from "react";

/**
 * Persistent localStorage state hook for the demo modules.
 *
 * Lets toggles, connections, generated API keys, and MCP servers
 * "stay set" while recording a demo or video, without needing a
 * backend. The state lives in the browser.
 *
 * Returns [value, setValue, hydrated]. Use `hydrated` to avoid hydration
 * flicker: render the dynamic data only when hydrated === true.
 */
export function useDemoState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // localStorage unavailable or invalid JSON: use initialValue
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist every change (once hydrated, so we don't overwrite with the default)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore (private mode, quota, etc.)
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
