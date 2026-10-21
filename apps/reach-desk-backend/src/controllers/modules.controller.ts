import type { NextFunction, Request, Response } from "express";
import {
  modulesRepository,
  type IModulesRepository,
} from "../repositories/modules.repository.js";
import { sendSuccess } from "../libs/response.js";

export class ModulesController {
  constructor(private readonly repo: IModulesRepository = modulesRepository) {}

  getModules = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const type = (request.query.type as string) || "external";
      const userType = type === "internal" ? "internal" : "external";
      const modules = await this.repo.findModulesByUserType(userType);

      sendSuccess(response, modules);
    } catch (err) {
      next(err);
    }
  };
}

export const modulesController = new ModulesController();
