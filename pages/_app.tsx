import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";

export default function App({ Component, pageProps }: AppProps) {
  // Aplicar colores dinámicos desde siteConfig a las variables CSS
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", siteConfig.primaryColor);
    root.style.setProperty("--color-secondary", siteConfig.secondaryColor);
  }, []);

  return <Component {...pageProps} />;
}


