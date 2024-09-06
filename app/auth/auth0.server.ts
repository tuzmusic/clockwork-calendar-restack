import { redirect } from "@remix-run/node";
import { google } from "googleapis";

import { googleTokensCookie } from "./cookies.server";

const { env } = process;
export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_OAUTH_REDIRECT_URL
);

export async function checkToken(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const googleToken = await googleTokensCookie.parse(cookieHeader);
  if (!googleToken) throw redirect("/login");
}
