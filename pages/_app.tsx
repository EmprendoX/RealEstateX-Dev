import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import { siteConfig } from "@/config/siteConfig";
import nextI18NextConfig from "../next-i18next.config";

function App({ Component, pageProps }: AppProps) {
  // Apply dynamic colors from siteConfig to the CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", siteConfig.primaryColor);
    root.style.setProperty("--color-secondary", siteConfig.secondaryColor);
  }, []);

  return <Component {...pageProps} />;
}

export default appWithTranslation(App, nextI18NextConfig);
