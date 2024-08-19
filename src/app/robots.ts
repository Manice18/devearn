import type { MetadataRoute } from "next";

// To tell search engine crawlers which URLs they can access on devearn.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://devearn.vercel.app/sitemap.xml",
  };
}

// Output:

// User-Agent: *
// Allow: /
// Sitemap: https://devearn.vercel.app/sitemap.xml
