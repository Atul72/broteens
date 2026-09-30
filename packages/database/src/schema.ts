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
