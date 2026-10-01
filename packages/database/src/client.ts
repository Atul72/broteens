import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://broteens:broteens@localhost:5433/broteens";

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql, { schema });

export async function closeDatabase(): Promise<void> {
  await sql.end({ timeout: 5 });
}
