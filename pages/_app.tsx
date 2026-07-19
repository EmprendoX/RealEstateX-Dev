import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Fraunces, Cormorant_Garamond, Playfair_Display, Inter, Manrope } from "next/font/google";
import { appWithTranslation } from "next-i18next";
import { siteConfig } from "@/config/siteConfig";
import nextI18NextConfig from "../next-i18next.config";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

// Statically-generated palette CSS. Injected once at first paint via `<style>` in
// the root — no FOUC, no useEffect. Change values in siteConfig.ts and rebuild.
const paletteCss = `:root {
  --color-primary: ${siteConfig.primaryColor};
  --color-accent: ${siteConfig.accentColor};
  --color-ink: ${siteConfig.inkColor};
  --color-surface: ${siteConfig.surfaceColor};
}`;

function displayFontVariable() {
  switch (siteConfig.displayFont) {
    case "cormorant": return cormorant.variable;
    case "playfair": return playfair.variable;
    case "fraunces":
    default: return fraunces.variable;
  }
}
function bodyFontVariable() {
  switch (siteConfig.bodyFont) {
    case "manrope": return manrope.variable;
    case "inter":
    default: return inter.variable;
  }
}
function displayFontFamily() {
  switch (siteConfig.displayFont) {
    case "cormorant": return "var(--font-cormorant)";
    case "playfair": return "var(--font-playfair)";
    case "fraunces":
    default: return "var(--font-fraunces)";
  }
}
function bodyFontFamily() {
  switch (siteConfig.bodyFont) {
    case "manrope": return "var(--font-manrope)";
    case "inter":
    default: return "var(--font-inter)";
  }
}

const fontCss = `:root {
  --font-display: ${displayFontFamily()};
  --font-body: ${bodyFontFamily()};
}`;

// Deferred scroll to the target hash (or top) after layout has settled.
// Uses `instant` behavior to override the global CSS `scroll-behavior: smooth`
// — a smooth scroll on initial paint is what makes the page look like it
// "starts in the middle".
function scrollToTarget(hash: string) {
  const doScroll = () => {
    if (hash && hash.length > 1) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };
  // Two rAFs: first waits for the current paint, second waits for any
  // reflow triggered by React hydration finishing.
  requestAnimationFrame(() => requestAnimationFrame(doScroll));
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Take scroll control away from the browser. Without this, reloading
  // in the middle of the landing scrolls back to where you left off —
  // and because globals.css has `scroll-behavior: smooth`, that
  // restoration is a visible animation. We land at the top unless the
  // URL carries an explicit #anchor, in which case we scroll to that
  // anchor ourselves (setting scrollRestoration=manual can suppress
  // the browser's built-in fragment scroll on initial load).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    scrollToTarget(window.location.hash);
  }, []);

  // Same treatment for client-side route changes.
  useEffect(() => {
    const onRouteChange = (url: string) => {
      const hashIdx = url.indexOf("#");
      scrollToTarget(hashIdx >= 0 ? url.slice(hashIdx) : "");
    };
    router.events.on("routeChangeComplete", onRouteChange);
    return () => router.events.off("routeChangeComplete", onRouteChange);
  }, [router.events]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: paletteCss + fontCss }} />
      <div className={`${displayFontVariable()} ${bodyFontVariable()}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
