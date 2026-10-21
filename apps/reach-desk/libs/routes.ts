export const ROUTES = {
  // External
  home: "/",
  features: "/features",
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",

  // Internal
  settings: "/profile",
  templates: "/templates",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const INTERNAL_ROUTES = [ROUTES.settings, ROUTES.templates] as const;

export const EXTERNAL_ROUTES = [
  ROUTES.home,
  ROUTES.features,
  ROUTES.login,
  ROUTES.signup,
  ROUTES.resetPassword,
] as const;

export type InternalRoute = (typeof INTERNAL_ROUTES)[number];
export type ExternalRoute = (typeof EXTERNAL_ROUTES)[number];

export function isInternalRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  const cleanPath = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  return INTERNAL_ROUTES.some(
    (internalRoute) =>
      cleanPath === internalRoute || cleanPath.startsWith(`${internalRoute}/`),
  );
}

export function isExternalRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  return !isInternalRoute(pathname);
}

export function shouldShowFooter(pathname?: string | null): boolean {
  return !isInternalRoute(pathname);
}
