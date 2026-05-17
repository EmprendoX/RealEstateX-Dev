import { GetServerSideProps } from "next";
import { siteConfig } from "@/config/siteConfig";

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();

  return { props: {} };
};
