import type { MetadataRoute } from "next";

// To help search engine crawlers crawl your site more efficiently.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://devearn.vercel.app/",
      lastModified: new Date(),
    },
  ];
}

// Output:

// <urlset xmlns="/schemas/sitemap/0.9">
//   <url>
//     <loc></loc>
//     <lastmod>2023-04-06T15:02:24.021Z</lastmod>
//   </url>
// </urlset>
