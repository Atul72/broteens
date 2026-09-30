import type { CrawlConfig, CrawlStatus } from "@broteens/contracts";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "./client.js";
import {
  crawlJobs,
  crawlLinks,
  crawlPages,
  type NewCrawlLink,
  type NewCrawlPage,
} from "./schema.js";

export async function createCrawlJob(config: CrawlConfig) {
  const [job] = await db
    .insert(crawlJobs)
    .values({ seedUrl: config.url, configuration: config })
    .returning();

  if (!job) throw new Error("Database did not return the created crawl job");
  return job;
}

export async function getCrawlJob(id: string) {
  const [job] = await db
    .select()
    .from(crawlJobs)
    .where(eq(crawlJobs.id, id))
    .limit(1);
  return job ?? null;
}

export async function setCrawlStatus(
  id: string,
  status: CrawlStatus,
  errorMessage?: string,
): Promise<void> {
  const now = new Date();
  await db
    .update(crawlJobs)
    .set({
      status,
      errorMessage: errorMessage ?? null,
      ...(status === "running" ? { startedAt: now } : {}),
      ...(["completed", "failed", "cancelled"].includes(status)
        ? { completedAt: now }
        : {}),
    })
    .where(eq(crawlJobs.id, id));
}

export interface CrawlProgress {
  discoveredCount: number;
  processedCount: number;
  successfulCount: number;
  failedCount: number;
}

export async function updateCrawlProgress(
  id: string,
  progress: CrawlProgress,
): Promise<void> {
  await db.update(crawlJobs).set(progress).where(eq(crawlJobs.id, id));
}

export async function saveCrawlPage(page: NewCrawlPage) {
  const [stored] = await db
    .insert(crawlPages)
    .values(page)
    .onConflictDoUpdate({
      target: [crawlPages.crawlJobId, crawlPages.normalizedUrl],
      set: {
        status: page.status,
        statusCode: page.statusCode,
        contentType: page.contentType,
        title: page.title,
        description: page.description,
        author: page.author,
        language: page.language,
        markdown: page.markdown,
        textContent: page.textContent,
        contentHash: page.contentHash,
        renderingMethod: page.renderingMethod,
        responseTimeMs: page.responseTimeMs,
        errorMessage: page.errorMessage,
        fetchedAt: new Date(),
      },
    })
    .returning();

  if (!stored) throw new Error("Database did not return the stored page");
  return stored;
}

export async function saveCrawlLinks(links: NewCrawlLink[]): Promise<void> {
  if (links.length === 0) return;
  await db.insert(crawlLinks).values(links).onConflictDoNothing();
}

export async function listCrawlPages(
  crawlJobId: string,
  limit = 50,
  offset = 0,
) {
  return db
    .select({
      id: crawlPages.id,
      url: crawlPages.url,
      normalizedUrl: crawlPages.normalizedUrl,
      depth: crawlPages.depth,
      status: crawlPages.status,
      statusCode: crawlPages.statusCode,
      title: crawlPages.title,
      renderingMethod: crawlPages.renderingMethod,
      fetchedAt: crawlPages.fetchedAt,
    })
    .from(crawlPages)
    .where(eq(crawlPages.crawlJobId, crawlJobId))
    .orderBy(asc(crawlPages.depth), asc(crawlPages.url))
    .limit(limit)
    .offset(offset);
}

export async function getCrawlPage(id: string) {
  const [page] = await db
    .select()
    .from(crawlPages)
    .where(eq(crawlPages.id, id))
    .limit(1);
  return page ?? null;
}

export async function isCrawlCancelled(id: string): Promise<boolean> {
  const job = await getCrawlJob(id);
  return job?.status === "cancelled";
}

export async function countCrawlPages(crawlJobId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(crawlPages)
    .where(and(eq(crawlPages.crawlJobId, crawlJobId)));
  return result?.count ?? 0;
}
