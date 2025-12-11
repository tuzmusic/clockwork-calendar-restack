import { ClerkClient, User } from "@clerk/remix/api.server";
import { google } from "googleapis";

export async function getOAuthClient(user: User, clerkClient: ClerkClient) {
  // Find the Google external account
  const googleAccount = user.externalAccounts.find(
    (account) => account.provider.replace("oauth_", "") === "google",
  );

  if (!googleAccount) {
    throw new Error("Google account not connected");
  }

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    user.id,
    "google",
  );
  const accessToken = clerkResponse.data[0].token || "";
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return oauth2Client;
}
