import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { userTypeEnum } from "./enums.js";

export const appModules = pgTable(
  "app_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    module: varchar("module", { length: 255 }).notNull(),
    userType: userTypeEnum("user_type").notNull().default("external"),
    description: text("description"),
    index: integer("index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("app_modules_module_user_type_uq").on(
      table.module,
      table.userType,
    ),
    index("app_modules_user_type_idx").on(table.userType),
  ],
);

export type AppModule = typeof appModules.$inferSelect;
export type NewAppModule = typeof appModules.$inferInsert;
