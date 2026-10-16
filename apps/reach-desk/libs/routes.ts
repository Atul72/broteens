/**
 * Application Routes Configuration
 *
 * Internal routes: Protected workspace/account routes (e.g. /settings)
 * External routes: Public-facing marketing and authentication routes (e.g. /, /features, /login, /signup, /reset-password)
 */

export const ROUTES = {
  // External (Marketing & Authentication)
  home: "/",
  features: "/features",
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",

  // Internal (Workspace / Account)
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Internal Routes: As specified, keep settings only as the internal route.
 */
export const INTERNAL_ROUTES = [ROUTES.settings] as const;

/**
 * External Routes: All other routes belong to external.
 */
export const EXTERNAL_ROUTES = [
  ROUTES.home,
  ROUTES.features,
  ROUTES.login,
  ROUTES.signup,
  ROUTES.resetPassword,
] as const;

export type InternalRoute = (typeof INTERNAL_ROUTES)[number];
export type ExternalRoute = (typeof EXTERNAL_ROUTES)[number];

/**
 * Returns true if the given pathname is an internal route (e.g. /settings or /settings/*).
 */
export function isInternalRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  const cleanPath = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  return INTERNAL_ROUTES.some(
    (internalRoute) =>
      cleanPath === internalRoute || cleanPath.startsWith(`${internalRoute}/`),
  );
}

/**
 * Returns true if the given pathname is an external route.
 */
export function isExternalRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  return !isInternalRoute(pathname);
}

/**
 * Based on route classification:
 * Internal routes (e.g. /settings) remove/hide the footer.
 * External routes keep the footer.
 */
export function shouldShowFooter(pathname?: string | null): boolean {
  return !isInternalRoute(pathname);
}
