/**
 * i18n configuration for next-i18next.
 * Spanish ("es") stays as the default locale; English ("en") is added.
 */
/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
