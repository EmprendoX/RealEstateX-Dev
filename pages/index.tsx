import React from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../next-i18next.config";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import ConceptSection from "@/components/ConceptSection";
import TrustStrip from "@/components/TrustStrip";
import LocationSection from "@/components/LocationSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import ModelsSection from "@/components/ModelsSection";
import AvailabilitySection from "@/components/AvailabilitySection";
import PaymentPlanSection from "@/components/PaymentPlanSection";
import InvestmentSection from "@/components/InvestmentSection";
import ConstructionProgressSection from "@/components/ConstructionProgressSection";
import DeveloperTrustSection from "@/components/DeveloperTrustSection";
import LeadCaptureSection from "@/components/LeadCaptureSection";
import DossierCTA from "@/components/DossierCTA";
import { development, t as tDev } from "@/data/development";
import { siteConfig } from "@/config/siteConfig";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"], nextI18NextConfig)),
    },
  };
};

export default function Home() {
  const { locale } = useRouter();
  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const absoluteImages = development.heroImages.map((img) =>
    /^https?:\/\//i.test(img) ? img : `${baseUrl}${img.startsWith("/") ? img : `/${img}`}`
  );

  // Schema.org Residence — real estate development at project-level
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: development.name,
    description: tDev.text(development.intro, locale),
    url: baseUrl,
    image: absoluteImages,
    address: {
      "@type": "PostalAddress",
      streetAddress: tDev.text(development.location.address, locale),
      addressLocality: development.location.city,
      addressRegion: development.location.state,
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: development.location.latitude,
      longitude: development.location.longitude,
    },
  };

  return (
    <Layout jsonLd={jsonLd}>
      {/* Section order — per critique 2026-07-18:
         desire → product → trust → location → deeper spec → action */}
      <Hero />
      <ConceptSection />
      <TrustStrip />
      <LocationSection />
      <AmenitiesSection />
      <ModelsSection />
      <AvailabilitySection />
      <PaymentPlanSection />
      <InvestmentSection />
      <ConstructionProgressSection />
      <DeveloperTrustSection />
      <LeadCaptureSection />
      <DossierCTA />
    </Layout>
  );
}
