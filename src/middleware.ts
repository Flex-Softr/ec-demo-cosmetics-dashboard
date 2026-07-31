import { NextRequest, NextResponse } from "next/server";
import envConfig from "./config/config";
import { ROLES } from "./const/role";
import getAccessToken from "./lib/getAccessToken";
import { TUser } from "./redux/features/auth/interface";
import decodeJWT from "./utilities/decodeJWT";

const basePath = envConfig.base_path || "/admin";

const PUBLIC_PATHS = [
  "/login",
  "/forget-password",
  "/reset-password",
  "/error",
];

/** Normalize pathname whether or not Next included basePath. */
function appPathname(pathname: string) {
  if (basePath && pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  return pathname;
}

function isPublicPath(pathname: string) {
  const path = appPathname(pathname);
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );
}

export async function middleware(request: NextRequest) {
  const path = appPathname(request.nextUrl.pathname);

  // Never redirect public auth pages (prevents ERR_TOO_MANY_REDIRECTS)
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("_app.ec.at")?.value || "";
  const refreshToken = request.cookies.get("_app.ec.rt")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (!accessToken) {
    return getAccessToken(request);
  }

  const currentUser = decodeJWT(accessToken as string) as TUser;

  if (
    currentUser.role !== ROLES.SUPER_ADMIN &&
    currentUser.role !== ROLES.ADMIN &&
    currentUser.role !== ROLES.STAFF
  ) {
    return NextResponse.redirect(new URL(`${basePath}/error`, request.url));
  }

  if (path === "/dashboard/user") {
    return NextResponse.redirect(
      new URL(`${basePath}/dashboard/user/profile`, request.url)
    );
  }

  return NextResponse.next();
}

// Must be static string literals (variables are ignored → middleware runs on all routes).
// With basePath: "/admin", these match /admin/dashboard and /admin/dashboard/*
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
