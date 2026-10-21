export const ROUTES = {
  templates: "/templates",
  settings: "/profile",
  callback: "/auth/callback",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const INTERNAL_ROUTES = [
  ROUTES.templates,
  ROUTES.settings,
  ROUTES.callback,
] as const;

export function isInternalRoute(_pathname?: string | null): boolean {
  return true;
}

export function isExternalRoute(_pathname?: string | null): boolean {
  return false;
}
