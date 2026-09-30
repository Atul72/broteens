import type { CrawlConfig } from "@broteens/contracts";
import { chromium, type Browser } from "playwright";
import { CRAWLER_USER_AGENT } from "./robots.js";

export class BrowserRenderer {
  private browser: Browser | null = null;

  async render(
    url: string,
    config: Pick<CrawlConfig, "includeImages" | "requestTimeoutMs">,
  ): Promise<{ html: string; finalUrl: string }> {
    this.browser ??= await chromium.launch({ headless: true });
    const page = await this.browser.newPage({ userAgent: CRAWLER_USER_AGENT });

    if (!config.includeImages) {
      await page.route("**/*", async (route) => {
        const type = route.request().resourceType();
        if (["image", "media", "font"].includes(type)) await route.abort();
        else await route.continue();
      });
    }

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: config.requestTimeoutMs,
      });
      await page
        .waitForLoadState("networkidle", {
          timeout: Math.min(config.requestTimeoutMs, 5_000),
        })
        .catch(() => undefined);

      return { html: await page.content(), finalUrl: page.url() };
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
  }
}

/*
One important limitation is that this implementation currently returns anti-bot challenge HTML as if it were real content. You should inspect the Response returned by page.goto() and run the challenge-page detection before returning page.content(). It also needs SSRF protection before production use so users cannot request internal addresses such as localhost, 127.0.0.1, or cloud metadata endpoints.
*/
