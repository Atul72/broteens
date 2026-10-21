import type { Request, Response } from "express";
import { sql } from "@broteens/database";

export class HealthController {
  live(_request: Request, response: Response): void {
    response.status(200).json({ status: "ok" });
  }

  async ready(_request: Request, response: Response): Promise<void> {
    await sql`select 1`;
    response.status(200).json({ status: "ready" });
  }
}

export const healthController = new HealthController();
