import type { AppProps } from "next/app";
import "@/styles/globals.css";
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

function App({ Component, pageProps }: AppProps) {
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
