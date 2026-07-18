import { GetServerSideProps } from "next";
import { siteConfig } from "@/config/siteConfig";

function generateSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  // Single-development site — just the landing page (plus its English variant).
  const entries = [
    { loc: "/", priority: "1.0" },
    { loc: "/en", priority: "0.9" },
  ];

  const urls = entries
    .map(
      ({ loc, priority }) => `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const sitemap = generateSitemap(baseUrl);

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(sitemap);
  res.end();

  return { props: {} };
};
