import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { google } from "googleapis";

import { oauth2Client } from "~/auth/auth0.server";
import { googleTokensCookie } from "~/auth/cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  oauth2Client.on("tokens", ({ access_token, refresh_token }) => {
    if (access_token) {
      // store the access_token in my database!
      oauth2Client.setCredentials({ access_token });
      console.log("access token:", access_token);
    }
    if (refresh_token) {
      // store the refresh_token in my database!
      oauth2Client.setCredentials({ refresh_token });
      console.log("refresh token:", refresh_token);
    }
  });

  google.options({ auth: oauth2Client });

  console.log({ tokens });

  return redirect("/select-calendar", {
    headers: {
      "Set-Cookie": await googleTokensCookie.serialize(tokens)
    }
  });
}
