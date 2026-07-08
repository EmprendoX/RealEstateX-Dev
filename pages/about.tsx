import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/components/Layout";
import { siteConfig } from "@/config/siteConfig";
import { getAboutContent, renderTemplate } from "@/data/aboutPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"])),
    },
  };
};

export default function AboutPage() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const aboutContent = getAboutContent(locale);
  const tplVars = { city: siteConfig.city, brokerName: siteConfig.brokerName };
  const whatsappMessage = encodeURIComponent(t("about.servicesMessage"));
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  return (
    <Layout
      title={t("about.metaTitle")}
      description={t("about.metaDescription", {
        name: siteConfig.brokerName,
        city: siteConfig.city,
      })}
      canonicalPath="/about"
    >
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("about.heading")}</h1>
            <p className="text-lg text-gray-600">
              {t("about.subtitle", { city: siteConfig.city })}
            </p>
          </div>

          {/* Photo and name */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={aboutContent.brokerPhoto}
                  alt={siteConfig.brokerName}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {siteConfig.brokerName}
                </h2>
                <p className="text-xl text-primary mb-4">{aboutContent.role}</p>
                <p className="text-gray-600 mb-4">📍 {siteConfig.city}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    📞 {siteConfig.phone}
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    ✉️ {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {aboutContent.bio.heading}
            </h2>
            {aboutContent.bio.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-gray-700 leading-relaxed ${
                  i < aboutContent.bio.paragraphs.length - 1 ? "mb-4" : ""
                }`}
              >
                {renderTemplate(p, tplVars)}
              </p>
            ))}
          </div>

          {/* How I work */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {aboutContent.howIWork.heading}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {renderTemplate(aboutContent.howIWork.intro, tplVars)}
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
              {aboutContent.howIWork.pillars.map((pillar, i) => (
                <li key={i}>
                  <strong className="text-gray-900">{pillar.title}:</strong>{" "}
                  {renderTemplate(pillar.description, tplVars)}
                </li>
              ))}
            </ul>
            {aboutContent.howIWork.outro && (
              <p className="text-gray-700 leading-relaxed mt-4">
                {renderTemplate(aboutContent.howIWork.outro, tplVars)}
              </p>
            )}
          </div>

          {/* Why work with me */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {aboutContent.whyMe.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutContent.whyMe.items.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ✅ {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {renderTemplate(item.description, tplVars)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary text-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("about.ctaHeading")}
            </h2>
            <p className="text-lg mb-6 text-primary-100">
              {t("about.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {t("about.contactNow")}
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {t("about.whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
