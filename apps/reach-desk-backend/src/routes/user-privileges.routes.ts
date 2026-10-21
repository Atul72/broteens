import { Router } from "express";
import { userPrivilegesController } from "../controllers/user-privileges.controller.js";

const userPrivilegesRouter: Router = Router();

// GET /v1/users/:userId/privileges
userPrivilegesRouter.get(
  "/:userId/privileges",
  userPrivilegesController.getUserPrivileges,
);

export { userPrivilegesRouter };
