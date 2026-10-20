import type { CrawlConfig } from "@broteens/contracts";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { crawlStatusEnum } from "./enums.js";

export const crawlJobs = pgTable(
  "crawl_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seedUrl: text("seed_url").notNull(),
    status: crawlStatusEnum("status").notNull().default("queued"),
    configuration: jsonb("configuration").$type<CrawlConfig>().notNull(),
    discoveredCount: integer("discovered_count").notNull().default(0),
    processedCount: integer("processed_count").notNull().default(0),
    successfulCount: integer("successful_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [index("crawl_jobs_status_idx").on(table.status)],
);

export type CrawlJob = typeof crawlJobs.$inferSelect;
