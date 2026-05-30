"use server";
import { NextRequest } from "next/server";
import { PERMISSIONS } from "./const/permissions";
import { ROLES } from "./const/role";
import getAccessToken, { getPermission } from "./lib/getAccessToken";
import { TUser } from "./redux/features/auth/interface";
import decodeJWT from "./utilities/decodeJWT";
import isPermitted from "./utilities/isPermitted";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("_app.ec.at")?.value || "";
  const refreshToken = request.cookies.get("_app.ec.rt")?.value;

  if (!refreshToken) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (!accessToken) {
    const res = await getAccessToken(request);
    return res;
  }

  const currentUser = decodeJWT(accessToken as string) as TUser; // Decode the JWT
  // const currentUser = { role: "admin" }; // Decode the JWT

  if (
    currentUser.role !== ROLES.SUPER_ADMIN &&
    currentUser.role !== ROLES.ADMIN &&
    currentUser.role !== ROLES.STAFF
  ) {
    return Response.redirect(new URL("/error", request.url));
  }

  const { permissions } = await getPermission();

  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    if (isPermitted(permissions)) {
      return Response.redirect(new URL("/dashboard", request.url));
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT)) {
      return Response.redirect(new URL("/dashboard/products", request.url));
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_BLOG)) {
      return Response.redirect(new URL("/dashboard/blog-posts", request.url));
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_ORDER)) {
      return Response.redirect(new URL("/dashboard/orders", request.url));
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_PROCESSING_ORDER)) {
      return Response.redirect(
        new URL("/dashboard/processing-orders", request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_COURIER)) {
      return Response.redirect(
        new URL("/dashboard/courier-management", request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_WARRANTY_CLAIM)) {
      return Response.redirect(
        new URL("/dashboard/warranty-claims", request.url)
      );
    } else if (isPermitted(permissions, PERMISSIONS.MANAGE_ADMIN_OR_STAFF)) {
      return Response.redirect(
        new URL("/dashboard/manage-admin-staff", request.url)
      );
    } else return Response.redirect(new URL("/error", request.url));
  }
  if (request.nextUrl.pathname === "/dashboard/user") {
    return Response.redirect(new URL("/dashboard/user/profile", request.url));
  }
  return null;
}

// ✅ Apply or will run middleware only to these routes,
// variable name must be config, else will run middleware to every route
export const config = {
  matcher: ["/dashboard/:path*"],
};
