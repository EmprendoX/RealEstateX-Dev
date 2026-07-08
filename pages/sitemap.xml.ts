import { GetServerSideProps } from "next";
import { properties } from "@/data/properties";
import { siteConfig } from "@/config/siteConfig";

function generateSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  const staticPaths = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/properties", priority: "0.9", changefreq: "daily" },
    { loc: "/about", priority: "0.6", changefreq: "monthly" },
    { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  ];

  const propertyPaths = properties.map((p) => ({
    loc: `/properties/${p.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const urls = [...staticPaths, ...propertyPaths]
    .map(
      ({ loc, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
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
  // Rendered in getServerSideProps; the component is never mounted
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
