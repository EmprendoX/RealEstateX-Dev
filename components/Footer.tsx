"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { siteConfig } from "@/config/siteConfig";
import { development, t as tDev } from "@/data/development";

export default function Footer() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const year = new Date().getFullYear();

  const socials = [
    siteConfig.instagram && { label: "Instagram", href: siteConfig.instagram },
    siteConfig.facebook && { label: "Facebook", href: siteConfig.facebook },
    siteConfig.tiktok && { label: "TikTok", href: siteConfig.tiktok },
    siteConfig.linkedin && { label: "LinkedIn", href: siteConfig.linkedin },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <footer className="bg-ink text-white/85">
      <div className="max-w-editorial mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="font-display text-3xl text-white tracking-tightest">{siteConfig.logoText}</p>
            <p className="mt-4 max-w-md text-white/70 leading-relaxed">
              {tDev.text(development.tagline, locale)}
            </p>
            <p className="mt-6 text-eyebrow text-white/50">{t("footer.locationLabel")}</p>
            <p className="mt-2 text-sm text-white/70">
              {tDev.text(development.location.address, locale)}
            </p>
          </div>

          <div>
            <p className="text-eyebrow text-white/50 mb-4">{t("footer.explore")}</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#concepto" className="hover:text-white">{t("nav.concept")}</a></li>
              <li><a href="#modelos" className="hover:text-white">{t("nav.models")}</a></li>
              <li><a href="#disponibilidad" className="hover:text-white">{t("nav.availability")}</a></li>
              <li><a href="#inversion" className="hover:text-white">{t("nav.investment")}</a></li>
              <li><a href="#avance" className="hover:text-white">{t("nav.progress")}</a></li>
            </ul>
          </div>

          <div>
            <p className="text-eyebrow text-white/50 mb-4">{t("footer.contact")}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            {socials.length > 0 && (
              <>
                <p className="text-eyebrow text-white/50 mt-6 mb-3">{t("footer.followUs")}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} {development.name}. {t("footer.rightsReserved")}</p>
          <p>
            {t("footer.developedBy")} <span className="text-white/80">{siteConfig.developerCompany}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
