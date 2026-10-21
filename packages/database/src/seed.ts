import { and, eq } from "drizzle-orm";
import { db } from "./client.js";
import { appModules, userPrivileges, users } from "./schema/index.js";

export async function seed() {
  console.log("Seeding database modules...");

  // 1. Insert templates module (external only)
  let [templateModule] = await db
    .select()
    .from(appModules)
    .where(
      and(
        eq(appModules.module, "templates"),
        eq(appModules.userType, "external"),
      ),
    )
    .limit(1);

  if (!templateModule) {
    [templateModule] = await db
      .insert(appModules)
      .values({
        module: "templates",
        userType: "external",
        description: "Templates module description",
        index: 1,
      })
      .returning();
    console.log("Created templates module:", templateModule?.id);
  }

  // 2. Map templates module to all external users
  if (templateModule) {
    const allUsers = await db.select().from(users);
    for (const user of allUsers) {
      if (user.userType === "external") {
        await db
          .insert(userPrivileges)
          .values({
            userId: user.id,
            moduleId: templateModule.id,
            description: "Templates access",
          })
          .onConflictDoNothing();
      }
    }
    console.log("Mapped templates module to external users.");
  }
}

seed()
  .then(() => {
    console.log("Seed completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
