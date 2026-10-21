/**
 * Templates Controller
 * Placeholder / skeleton for template endpoints.
 * Implementation will be added after template editor setup.
 */

import {
  templatesRepository,
  type ITemplatesRepository,
} from "../repositories/templates.repository.js";

export class TemplatesController {
  constructor(
    private readonly repo: ITemplatesRepository = templatesRepository,
  ) {}

  // Controller handlers will be added after template editor setup
}

export const templatesController = new TemplatesController();
