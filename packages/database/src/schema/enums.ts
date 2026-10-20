import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "user",
  "moderator",
]);

export const userTypeEnum = pgEnum("user_type", ["internal", "external"]);

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
