"use server";
import { NextRequest } from "next/server";
import getAccessToken, { getPermission } from "./lib/getAccessToken";
import { TUser } from "./redux/features/auth/interface";
import { permission } from "./types/order/order.interface";
import decodeJWT from "./utilities/decodeJWT";
import isPermitted from "./utilities/isPermitted";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("__app.ec.at")?.value || "";
  const refreshToken = request.cookies.get("__app.ec.rt")?.value;

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
    currentUser.role !== "superAdmin" &&
    currentUser.role !== "admin" &&
    currentUser.role !== "staff"
  ) {
    return Response.redirect(new URL("/error", request.url));
  }

  const { permissions } = getPermission();

  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    if (isPermitted(permissions)) {
      return Response.redirect(new URL("/dashboard", request.url));
    } else if (isPermitted(permissions, permission.manageProduct)) {
      return Response.redirect(new URL("/dashboard/products", request.url));
    } else if (isPermitted(permissions, permission.manageOrder)) {
      return Response.redirect(new URL("/dashboard/orders", request.url));
    } else if (isPermitted(permissions, permission.manageProcessing)) {
      return Response.redirect(
        new URL("/dashboard/processing-orders", request.url)
      );
    } else if (isPermitted(permissions, permission.manageCourier)) {
      return Response.redirect(
        new URL("/dashboard/courier-management", request.url)
      );
    } else if (isPermitted(permissions, permission.manageWarrantyClaim)) {
      return Response.redirect(
        new URL("/dashboard/warranty-claims", request.url)
      );
    } else if (isPermitted(permissions, permission.manageAdminOrStaff)) {
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

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|login|registration|error).*)",
  ],
};
