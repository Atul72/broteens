import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { appModules } from "./app-modules.js";
import { users } from "./users.js";

export const userPrivileges = pgTable(
  "user_privileges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => appModules.id, { onDelete: "cascade" }),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_privileges_user_module_uq").on(
      table.userId,
      table.moduleId,
    ),
    index("user_privileges_user_id_idx").on(table.userId),
    index("user_privileges_module_id_idx").on(table.moduleId),
  ],
);

export type UserPrivilege = typeof userPrivileges.$inferSelect;
export type NewUserPrivilege = typeof userPrivileges.$inferInsert;
