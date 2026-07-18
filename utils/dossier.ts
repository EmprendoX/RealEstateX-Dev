/**
 * Open the sticky <DossierCTA/> modal from anywhere in the app.
 * Dispatched as a window CustomEvent so callers don't need to
 * import shared React context or thread props.
 *
 * Usage:
 *   <button onClick={openDossier}>Solicitar plano detallado</button>
 */
export function openDossier(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("openDossier"));
}
