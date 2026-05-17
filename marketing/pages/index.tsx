import Head from "next/head";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SITE_TITLE = "RealEstateX — Web inmobiliaria para brokers, lista en 48hs";
const SITE_DESC =
  "Web profesional con tu marca, SEO real, fichas en PDF, calculadora de hipoteca y leads directos a tu inbox. Para brokers inmobiliarios independientes y agencias chicas.";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESC} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESC} />
        <meta property="og:locale" content="es_MX" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
