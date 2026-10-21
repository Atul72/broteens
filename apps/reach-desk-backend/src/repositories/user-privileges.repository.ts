import { and, eq, isNull } from "drizzle-orm";
import { appModules, db, userPrivileges } from "@broteens/database";

export interface UserPrivilegeWithModule {
  id: string;
  userId: string;
  moduleId: string;
  moduleName: string;
  userType: "external" | "internal";
  description: string | null;
  createdAt: Date;
}

export interface IUserPrivilegesRepository {
  findUserPrivileges(userId: string): Promise<UserPrivilegeWithModule[]>;
}

export class UserPrivilegesRepository implements IUserPrivilegesRepository {
  async findUserPrivileges(userId: string): Promise<UserPrivilegeWithModule[]> {
    return db
      .select({
        id: userPrivileges.id,
        userId: userPrivileges.userId,
        moduleId: userPrivileges.moduleId,
        moduleName: appModules.module,
        userType: appModules.userType,
        description: userPrivileges.description,
        createdAt: userPrivileges.createdAt,
      })
      .from(userPrivileges)
      .innerJoin(appModules, eq(userPrivileges.moduleId, appModules.id))
      .where(
        and(
          eq(userPrivileges.userId, userId),
          isNull(userPrivileges.deletedAt),
        ),
      );
  }
}

export const userPrivilegesRepository = new UserPrivilegesRepository();
