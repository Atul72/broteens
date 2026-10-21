import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";

const healthRouter: Router = Router();

healthRouter.get("/live", healthController.live);
healthRouter.get("/ready", (req, res, next) => {
  healthController.ready(req, res).catch(next);
});

export { healthRouter };
