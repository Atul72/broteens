import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { modulesRouter } from "./modules.routes.js";
import { userPrivilegesRouter } from "./user-privileges.routes.js";
import { templatesRouter } from "./templates.routes.js";

const apiRouter: Router = Router();

// Health checks
apiRouter.use("/health", healthRouter);

// Modules
apiRouter.use("/v1/modules", modulesRouter);

// User privileges
apiRouter.use("/v1/users", userPrivilegesRouter);

// Templates (routes will be added after template editor setup)
apiRouter.use("/v1/templates", templatesRouter);

export { apiRouter };
