/**
 * i18n configuration for next-i18next.
 * Spanish ("es") stays as the default locale; English ("en") is added.
 */
const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    localeDetection: false,
  },
  // Resolve the locales folder relative to the working directory at runtime.
  // Combined with outputFileTracingIncludes in next.config.js, this lets the
  // serverless functions (ISR pages) find the translation files on Netlify.
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
