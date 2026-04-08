"use server";
import config from "@/config/config";
import { PERMISSIONS } from "@/const/permissions";
import { TUser } from "@/redux/features/auth/interface";
import decodeJWT from "@/utilities/decodeJWT";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export default async function getAccessToken(request: NextRequest) {
  try {
    const refreshToken = cookies().get("_app.ec.rt")?.value || "";
    const res = await fetch(`${config.api_base_url}/api/v1/auth/access-token`, {
      method: "POST",
      headers: { authorization: refreshToken },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch access token");
    }
    const accessToken = await res.json();
    const token = accessToken.data?.accessToken;

    const cookieOption = {
      domain:
        config.env === "production" ? `.${config.main_domain}` : "localhost",
      httpOnly: config.env === "production",
      secure: config.env === "production",
      sameSite: "lax" as const,
      maxAge: Number(config.token_data.access_token_cookie_expires),
    };
    const response = NextResponse.next();
    response.cookies.set("_app.ec.at", token, cookieOption);
    return response;
  } catch (error) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export async function getProfile() {
  const accessToken = cookies().get("_app.ec.at")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const res = await fetch(`${config.api_base_url}/api/v1/users/profile`, {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "force-cache",
    next: { tags: ["profile"] },
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();
  return data?.data;
}

export const getPermission = () => {
  const accessToken = cookies().get("_app.ec.at")?.value;
  if (accessToken) {
    const user = decodeJWT(accessToken);

    return user as TUser;
  } else {
    return {
      permissions: [{ _id: "super_admin_id", name: PERMISSIONS.SUPER_ADMIN }],
    };
  }
};

export const accessTokenFromCookies = () => {
  return cookies().get("_app.ec.at")?.value;
};
