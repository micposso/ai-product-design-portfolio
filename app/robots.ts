import { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/case-study/",
          "/insights/",
          "/education/",
          "/llms.txt",
          "/openapi.json",
          "/ai-plugin.json",
          "/.well-known/",
        ],
        disallow: ["/login", "/register", "/api/history", "/api/reservation"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}

