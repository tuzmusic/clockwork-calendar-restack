import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import { oauth2Client } from "~/auth/auth0.server";
import { googleTokensCookie } from "~/auth/cookies.server";

export default class AccountService {
  private cookieHeader: string;
  private authClient: OAuth2Client
  private constructor(private request: Request) {
    this.authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );

    this.cookieHeader = request.headers.get("Cookie") ?? "";
  }

  private async parseCookie() {
    return await googleTokensCookie.parse(this.cookieHeader)
  }

  public static async authenticate(request: Request) {
    const authService = new this(request);
    const auth = await authService.parseCookie()

    authService.authClient.setCredentials(auth);
    authService.authClient.on("tokens", ({ access_token, refresh_token }) => {
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
    })

    return authService
  }

  public static async getCalendarList(request: Request) {
    await AccountService.authenticate(request)

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });
    return await calendar.calendarList.list()
  }
}
