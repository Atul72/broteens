import { CrawlConfig } from "@broteens/contracts";

import {
  integer,
  pgTable,
  boolean,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  index,
  pgEnum,
  date as pgDate,
  jsonb,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "user",
  "moderator",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "banned",
  "deleted",
]);
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);

export const authTokenTypeEnum = pgEnum("auth_token_type", [
  "access",
  "refresh",
  "password_reset",
]);

export const crawlStatusEnum = pgEnum("crawl_status", [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const pageStatusEnum = pgEnum("page_status", [
  "pending",
  "completed",
  "failed",
  "skipped",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull(),
    passwordHash: text("password_hash"),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("active"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("users_email_uq").on(table.email)],
);

export const authAccounts = pgTable(
  "auth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: authProviderEnum("provider").notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    providerEmail: varchar("provider_email", { length: 320 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_accounts_provider_account_uq").on(
      table.provider,
      table.providerAccountId,
    ),
    index("auth_accounts_user_idx").on(table.userId),
  ],
);

export const authTokens = pgTable(
  "auth_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: authTokenTypeEnum("type").notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    sessionId: uuid("session_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_tokens_hash_uq").on(table.tokenHash),
    index("auth_tokens_user_idx").on(table.userId),
    index("auth_tokens_session_idx").on(table.sessionId),
    index("auth_tokens_expiry_idx").on(table.expiresAt),
  ],
);

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

export type CrawlJob = typeof crawlJobs.$inferSelect;
export type CrawlPage = typeof crawlPages.$inferSelect;
export type NewCrawlPage = typeof crawlPages.$inferInsert;
export type NewCrawlLink = typeof crawlLinks.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuthAccount = typeof authAccounts.$inferSelect;
export type AuthToken = typeof authTokens.$inferSelect;
