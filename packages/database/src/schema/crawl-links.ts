import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { crawlJobs } from "./crawl-jobs.js";
import { crawlPages } from "./crawl-pages.js";

export const crawlLinks = pgTable(
  "crawl_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    crawlJobId: uuid("crawl_job_id")
      .notNull()
      .references(() => crawlJobs.id, { onDelete: "cascade" }),
    sourcePageId: uuid("source_page_id")
      .notNull()
      .references(() => crawlPages.id, { onDelete: "cascade" }),
    targetUrl: text("target_url").notNull(),
    normalizedTargetUrl: text("normalized_target_url").notNull(),
    anchorText: text("anchor_text"),
    isInternal: boolean("is_internal").notNull(),
    wasFollowed: boolean("was_followed").notNull().default(false),
  },
  (table) => [
    uniqueIndex("crawl_links_source_target_uq").on(
      table.sourcePageId,
      table.normalizedTargetUrl,
    ),
    index("crawl_links_job_idx").on(table.crawlJobId),
  ],
);

export type NewCrawlLink = typeof crawlLinks.$inferInsert;
