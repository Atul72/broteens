import { createHash } from "node:crypto";
import type { CrawlConfig } from "@broteens/contracts";
import { extractPage, type ExtractedLink } from "@broteens/extractor";
import { CheerioCrawler, RequestQueue } from "crawlee";
import { BrowserRenderer } from "./browser.js";
import {
  CRAWLER_USER_AGENT,
  isAllowedByRobots,
  loadRobotsRules,
} from "./robots.js";
import {
  assertPublicHttpUrl,
  isInternalUrl,
  matchesUrlPatterns,
  normalizeUrl,
} from "./url.js";

interface RequestMetadata {
  depth: number;
  parentUrl: string | null;
}

export interface CrawledLink extends ExtractedLink {
  normalizedUrl: string;
  isInternal: boolean;
  wasFollowed: boolean;
}

export interface CrawledPageResult {
  url: string;
  normalizedUrl: string;
  parentUrl: string | null;
  depth: number;
  status: "completed" | "failed" | "skipped";
  statusCode: number | null;
  contentType: string | null;
  title: string | null;
  description: string | null;
  author: string | null;
  language: string | null;
  markdown: string | null;
  textContent: string | null;
  contentHash: string | null;
  renderingMethod: "http" | "browser" | null;
  responseTimeMs: number;
  errorMessage: string | null;
  links: CrawledLink[];
}

export interface CrawlProgress {
  discoveredCount: number;
  processedCount: number;
  successfulCount: number;
  failedCount: number;
}

export interface CrawlCallbacks {
  onPage: (page: CrawledPageResult) => Promise<void>;
  onProgress?: (progress: CrawlProgress) => Promise<void>;
  shouldCancel?: () => Promise<boolean>;
}

function shouldUseBrowser(html: string, minimumCharacters: number): boolean {
  const visibleText = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return visibleText.length < minimumCharacters;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | null {
  const value = headers[name];
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

export async function runCrawl(
  crawlId: string,
  config: CrawlConfig,
  callbacks: CrawlCallbacks,
): Promise<CrawlProgress> {
  const seedUrl = normalizeUrl(config.url);
  await assertPublicHttpUrl(seedUrl);

  const robots = await loadRobotsRules(seedUrl, config.respectRobotsTxt);
  const renderer = new BrowserRenderer();
  const requestQueue = await RequestQueue.open(`crawl-${crawlId}`);
  const seen = new Set<string>([seedUrl]);
  const progress: CrawlProgress = {
    discoveredCount: 1,
    processedCount: 0,
    successfulCount: 0,
    failedCount: 0,
  };

  await requestQueue.addRequest({
    url: seedUrl,
    uniqueKey: seedUrl,
    userData: { depth: 0, parentUrl: null } satisfies RequestMetadata,
  });

  const reportProgress = async (): Promise<void> => {
    progress.discoveredCount = seen.size;
    await callbacks.onProgress?.({ ...progress });
  };

  const crawler = new CheerioCrawler({
    requestQueue,
    maxRequestsPerCrawl: config.maxPages,
    maxConcurrency: Number(process.env.CRAWLER_CONCURRENCY ?? 5),
    requestHandlerTimeoutSecs: Math.ceil(config.requestTimeoutMs / 1_000) + 15,
    navigationTimeoutSecs: Math.ceil(config.requestTimeoutMs / 1_000),
    additionalMimeTypes: ["application/xhtml+xml"],
    preNavigationHooks: [
      async ({ request }, gotOptions) => {
        await assertPublicHttpUrl(request.url);
        gotOptions.headers = {
          ...gotOptions.headers,
          "user-agent": CRAWLER_USER_AGENT,
        };
        const configuredDelay = Number(
          process.env.CRAWLER_REQUEST_DELAY_MS ?? 250,
        );
        const robotsDelay =
          (robots?.getCrawlDelay(CRAWLER_USER_AGENT) ?? 0) * 1_000;
        const delay = Math.max(configuredDelay, robotsDelay);
        if (delay > 0)
          await new Promise((resolve) => setTimeout(resolve, delay));
      },
    ],
    async requestHandler({ request, response, $, crawler: activeCrawler }) {
      if (await callbacks.shouldCancel?.()) {
        await activeCrawler.autoscaledPool?.abort();
        return;
      }

      const startedAt = Date.now();
      const metadata = request.userData as RequestMetadata;
      const loadedUrl = normalizeUrl(request.loadedUrl ?? request.url);
      await assertPublicHttpUrl(loadedUrl);

      let html = $.html();
      let finalUrl = loadedUrl;
      let renderingMethod: "http" | "browser" = "http";

      const needsBrowser =
        config.renderJavaScript === "always" ||
        (config.renderJavaScript === "auto" &&
          shouldUseBrowser(html, config.minContentCharacters));

      if (needsBrowser) {
        const rendered = await renderer.render(loadedUrl, config);
        await assertPublicHttpUrl(rendered.finalUrl);
        if (
          !isInternalUrl(rendered.finalUrl, seedUrl, config.followSubdomains)
        ) {
          throw new Error(
            `Browser navigation left the allowed site: ${rendered.finalUrl}`,
          );
        }
        html = rendered.html;
        finalUrl = normalizeUrl(rendered.finalUrl);
        renderingMethod = "browser";
      }

      const extracted = extractPage(html, finalUrl, config);
      const links: CrawledLink[] = [];

      for (const link of extracted.links) {
        let normalized: string;
        try {
          normalized = normalizeUrl(link.url);
        } catch {
          continue;
        }

        const internal = isInternalUrl(
          normalized,
          seedUrl,
          config.followSubdomains,
        );
        const followsPatterns = matchesUrlPatterns(
          normalized,
          config.allowPatterns,
          config.denyPatterns,
        );
        const canFollow =
          internal &&
          followsPatterns &&
          metadata.depth < config.maxDepth &&
          isAllowedByRobots(robots, normalized);

        let wasFollowed = false;
        if (canFollow && !seen.has(normalized)) {
          try {
            await assertPublicHttpUrl(normalized);
            seen.add(normalized);
            await requestQueue.addRequest({
              url: normalized,
              uniqueKey: normalized,
              userData: {
                depth: metadata.depth + 1,
                parentUrl: finalUrl,
              } satisfies RequestMetadata,
            });
            wasFollowed = true;
          } catch {
            // Unsafe and unresolvable links remain recorded but are not followed.
          }
        } else if (canFollow && seen.has(normalized)) {
          wasFollowed = true;
        }

        links.push({
          ...link,
          normalizedUrl: normalized,
          isInternal: internal,
          wasFollowed,
        });
      }

      progress.processedCount += 1;
      progress.successfulCount += 1;

      await callbacks.onPage({
        url: finalUrl,
        normalizedUrl: normalizeUrl(finalUrl),
        parentUrl: metadata.parentUrl,
        depth: metadata.depth,
        status: "completed",
        statusCode: response?.statusCode ?? null,
        contentType: response
          ? getHeader(response.headers, "content-type")
          : null,
        title: extracted.title,
        description: extracted.description,
        author: extracted.author,
        language: extracted.language,
        markdown: extracted.markdown,
        textContent: extracted.textContent,
        contentHash: createHash("sha256")
          .update(extracted.textContent)
          .digest("hex"),
        renderingMethod,
        responseTimeMs: Date.now() - startedAt,
        errorMessage: null,
        links,
      });
      await reportProgress();
    },
    async failedRequestHandler({ request }, error) {
      const metadata = request.userData as RequestMetadata;
      progress.processedCount += 1;
      progress.failedCount += 1;

      await callbacks.onPage({
        url: request.url,
        normalizedUrl: normalizeUrl(request.url),
        parentUrl: metadata.parentUrl,
        depth: metadata.depth,
        status: "failed",
        statusCode: null,
        contentType: null,
        title: null,
        description: null,
        author: null,
        language: null,
        markdown: null,
        textContent: null,
        contentHash: null,
        renderingMethod: null,
        responseTimeMs: 0,
        errorMessage: errorMessage(error),
        links: [],
      });
      await reportProgress();
    },
  });

  try {
    await crawler.run();
    await reportProgress();
    return progress;
  } finally {
    await renderer.close();
    await requestQueue.drop();
  }
}
