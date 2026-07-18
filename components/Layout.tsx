import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { siteConfig } from "@/config/siteConfig";
import { development, t as tDev } from "@/data/development";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
  jsonLd?: object;
  hideChrome?: boolean;
}

function toAbsoluteUrl(urlOrPath: string | undefined, base: string): string | undefined {
  if (!urlOrPath) return undefined;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${base.replace(/\/$/, "")}${path}`;
}

export default function Layout({
  children,
  title,
  description,
  image,
  canonicalPath,
  noindex,
  jsonLd,
  hideChrome = false,
}: LayoutProps) {
  const { locale } = useRouter();
  const ogLocale = locale === "en" ? "en_US" : "es_MX";

  const tagline = tDev.text(development.tagline, locale);
  const intro = tDev.text(development.intro, locale);

  const pageTitle = title
    ? `${title} | ${siteConfig.siteName}`
    : `${siteConfig.siteName} — ${tagline}`;
  const pageDescription = description || intro;

  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const canonical = canonicalPath
    ? `${baseUrl}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    : baseUrl;
  const ogImage = toAbsoluteUrl(image || development.heroImages[0], baseUrl);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonical} />
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.siteName} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter */}
        <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>

      <div className="min-h-screen flex flex-col bg-surface">
        {!hideChrome && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!hideChrome && <Footer />}

        {siteConfig.chatScript && (
          <div dangerouslySetInnerHTML={{ __html: siteConfig.chatScript }} />
        )}
      </div>
    </>
  );
}
