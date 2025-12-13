"use server";
import config from "@/config/config";
import { TUser } from "@/redux/features/auth/interface";
import decodeJWT from "@/utilities/decodeJWT";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function getAccessToken(request: NextRequest) {
  try {
    const refreshToken = cookies().get("__app.ec.rt")?.value || "";
    const res = await fetch(`${config.base_url}/api/v1/auth/access-token`, {
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
    response.cookies.set("__app.ec.at", token, cookieOption);
    return response;
  } catch (error) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export async function getProfile() {
  const accessToken = cookies().get("__app.ec.at")?.value;
  const res = await fetch(`${config.base_url}/api/v1/users/profile`, {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "force-cache",
    next: { tags: ["profile"] },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile data");
  }
  const data = await res.json();
  return data?.data;
}

export const getPermission = () => {
  const accessToken = cookies().get("__app.ec.at")?.value;
  if (accessToken) {
    const user = decodeJWT(accessToken);
    return user as TUser;
  } else {
    return {
      permissions: ["super admin"],
    };
  }
};

export const accessTokenFromCookies = () => {
  return cookies().get("__app.ec.at")?.value;
};
