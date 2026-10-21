import { Router } from "express";
import { modulesController } from "../controllers/modules.controller.js";

const modulesRouter: Router = Router();

// GET /v1/modules
modulesRouter.get("/", modulesController.getModules);

export { modulesRouter };
