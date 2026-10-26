import type { MetadataRoute } from "next";
import { siteConfig } from "@/libs/seo";

/**
 * Web Application Manifest generator.
 * Accessible at /manifest.webmanifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reachdesk - Email & WhatsApp Marketing Platform",
    short_name: "Reachdesk",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
