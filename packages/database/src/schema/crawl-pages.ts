import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { crawlJobs } from "./crawl-jobs.js";
import { pageStatusEnum } from "./enums.js";

export const crawlPages = pgTable(
  "crawl_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    crawlJobId: uuid("crawl_job_id")
      .notNull()
      .references(() => crawlJobs.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    normalizedUrl: text("normalized_url").notNull(),
    parentUrl: text("parent_url"),
    depth: integer("depth").notNull(),
    status: pageStatusEnum("status").notNull().default("pending"),
    statusCode: integer("status_code"),
    contentType: text("content_type"),
    title: text("title"),
    description: text("description"),
    author: text("author"),
    language: text("language"),
    markdown: text("markdown"),
    textContent: text("text_content"),
    contentHash: text("content_hash"),
    renderingMethod: text("rendering_method"),
    responseTimeMs: integer("response_time_ms"),
    errorMessage: text("error_message"),
    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("crawl_pages_job_url_uq").on(
      table.crawlJobId,
      table.normalizedUrl,
    ),
    index("crawl_pages_job_idx").on(table.crawlJobId),
  ],
);

export type CrawlPage = typeof crawlPages.$inferSelect;
export type NewCrawlPage = typeof crawlPages.$inferInsert;
