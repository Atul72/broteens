export const ROUTES = {
  home: "/",
  features: "/features",
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const EXTERNAL_ROUTES = [
  ROUTES.home,
  ROUTES.features,
  ROUTES.login,
  ROUTES.signup,
  ROUTES.resetPassword,
] as const;

export const INTERNAL_ROUTES = [] as const;

export type ExternalRoute = (typeof EXTERNAL_ROUTES)[number];

export function isInternalRoute(_pathname?: string | null): boolean {
  return false;
}

export function isExternalRoute(_pathname?: string | null): boolean {
  return true;
}

export function shouldShowFooter(pathname?: string | null): boolean {
  if (!pathname) return true;
  const cleanPath = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  return (
    cleanPath !== "/login" &&
    cleanPath !== "/signup" &&
    cleanPath !== "/reset-password"
  );
}
