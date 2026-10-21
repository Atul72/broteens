import type { NextFunction, Request, Response } from "express";
import { AppError } from "@broteens/errors";
import {
  userPrivilegesRepository,
  type IUserPrivilegesRepository,
} from "../repositories/user-privileges.repository.js";
import { sendSuccess } from "../libs/response.js";

export class UserPrivilegesController {
  constructor(
    private readonly repo: IUserPrivilegesRepository = userPrivilegesRepository,
  ) {}

  getUserPrivileges = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const rawUserId = request.params.userId;
      const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
      if (!userId) {
        throw new AppError(400, "INVALID_USER_ID", "User ID is required");
      }

      const privileges = await this.repo.findUserPrivileges(userId);
      sendSuccess(response, privileges);
    } catch (err) {
      next(err);
    }
  };
}

export const userPrivilegesController = new UserPrivilegesController();
