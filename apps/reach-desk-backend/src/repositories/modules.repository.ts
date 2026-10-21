import { and, desc, eq, isNull } from "drizzle-orm";
import { appModules, db, type AppModule } from "@broteens/database";

export interface IModulesRepository {
  findModulesByUserType(
    userType: "external" | "internal",
  ): Promise<AppModule[]>;
  findModuleById(id: string): Promise<AppModule | null>;
}

export class ModulesRepository implements IModulesRepository {
  async findModulesByUserType(
    userType: "external" | "internal",
  ): Promise<AppModule[]> {
    return db
      .select()
      .from(appModules)
      .where(
        and(eq(appModules.userType, userType), isNull(appModules.deletedAt)),
      )
      .orderBy(desc(appModules.createdAt));
  }

  async findModuleById(id: string): Promise<AppModule | null> {
    const rows = await db
      .select()
      .from(appModules)
      .where(and(eq(appModules.id, id), isNull(appModules.deletedAt)))
      .limit(1);

    return rows[0] ?? null;
  }
}

export const modulesRepository = new ModulesRepository();
