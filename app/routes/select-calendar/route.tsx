import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { google } from "googleapis";

import { selectedCalendarCookie } from "~/auth/cookies.server";
import AccountService from "~/data/services/AccountService.server";

dayjs.extend(timezone);
dayjs.extend(utc);

const CALENDAR_ID_KEY = "calendarId";

export async function loader(args: LoaderFunctionArgs) {
  // Use `getAuth()` to access `isAuthenticated` and the user's ID
  const { isAuthenticated, userId } = await getAuth(args);

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  // Get the user's full `Backend User` object
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const user = await clerkClient.users.getUser(userId);
  console.log(user);

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

  const list = await AccountService.getCalendarList(oauth2Client);
  return json(list);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const calendarId = formData.get(CALENDAR_ID_KEY);
  return redirect("/events", {
    headers: {
      "Set-Cookie": await selectedCalendarCookie.serialize(calendarId),
    },
  });
}

const SelectCalendar = () => {
  const calendars = useLoaderData<typeof loader>();

  return (
    <div className={"p-5"}>
      <h1 className={"font-bold"}>Select Calendar</h1>
      <form method="post">
        <ul>
          {calendars.map((cal) => (
            <li key={cal.id}>
              <button
                type="submit"
                value={cal.id ?? ""}
                name={CALENDAR_ID_KEY}
                className={"underline text-blue-700"}
              >
                {cal.summaryOverride ?? cal.summary}
              </button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default SelectCalendar;
