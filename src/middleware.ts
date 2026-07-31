import { NextRequest, NextResponse } from "next/server";
import envConfig from "./config/config";
import { PERMISSIONS } from "./const/permissions";
import { ROLES } from "./const/role";
import getAccessToken, { getPermission } from "./lib/getAccessToken";
import { TUser } from "./redux/features/auth/interface";
import decodeJWT from "./utilities/decodeJWT";
import isPermitted from "./utilities/isPermitted";

const basePath = envConfig.base_path;

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("_app.ec.at")?.value || "";
  const refreshToken = request.cookies.get("_app.ec.rt")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (!accessToken) {
    const res = await getAccessToken(request);
    return res;
  }

  const currentUser = decodeJWT(accessToken as string) as TUser;

  if (
    currentUser.role !== ROLES.SUPER_ADMIN &&
    currentUser.role !== ROLES.ADMIN &&
    currentUser.role !== ROLES.STAFF
  ) {
    return NextResponse.redirect(new URL(`${basePath}/error`, request.url));
  }

  const { permissions } = await getPermission();

  // With next.config basePath, matcher is auto-prefixed; pathname is without basePath.
  if (!request.nextUrl.pathname.startsWith(`/dashboard`)) {
    if (isPermitted(permissions)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/products`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_BLOG)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/blog-posts`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_ORDER)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/orders`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_PROCESSING_ORDER)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/processing-orders`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_COURIER)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/courier-management`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_WARRANTY_CLAIM)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/warranty-claims`, request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_ADMIN_OR_STAFF)) {
      return NextResponse.redirect(
        new URL(`${basePath}/dashboard/manage-admin-staff`, request.url)
      );
    } else
      return NextResponse.redirect(new URL(`${basePath}/error`, request.url));
  }
  if (request.nextUrl.pathname === `/dashboard/user`) {
    return NextResponse.redirect(
      new URL(`${basePath}/dashboard/user/profile`, request.url)
    );
  }
  return NextResponse.next();
}

// Matcher must be a static string — dynamic values are ignored and middleware
// runs on every route (including /login), which causes ERR_TOO_MANY_REDIRECTS.
// With basePath: "/admin", this matches /admin/dashboard/:path* automatically.
export const config = {
  matcher: ["/dashboard/:path*"],
};
