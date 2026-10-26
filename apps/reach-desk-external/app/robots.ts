import type { MetadataRoute } from "next";
import { siteConfig } from "@/libs/seo";

/**
 * Dynamic Robots.txt generator.
 * Accessible at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/features", "/login", "/signup"],
        disallow: [
          "/api/",
          "/profile",
          "/reset-password",
          "/auth/callback",
          "/_next/",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/features"],
        disallow: ["/api/", "/profile", "/login", "/signup"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
