import { useEffect, useState } from "react";

/**
 * Hook de estado persistente en localStorage para los módulos de demostración.
 *
 * Permite que toggles, conexiones, API keys generadas y servidores MCP
 * "se queden puestos" mientras se graba un demo o video, sin necesidad de
 * backend. El estado vive en el navegador.
 *
 * Devuelve [value, setValue, hydrated]. Usá `hydrated` para evitar parpadeos
 * de hidratación: renderizá la data dinámica solo cuando hydrated === true.
 */
export function useDemoState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage al montar (solo cliente)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // localStorage no disponible o JSON inválido: usar initialValue
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persistir cada cambio (una vez hidratado, para no pisar con el default)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorar (modo privado, cuota, etc.)
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
