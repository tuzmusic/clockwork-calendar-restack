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

import { selectedCalendarCookie } from "~/auth/cookies.server";
import AccountService from "~/data/services/AccountService.server";
import { getOAuthClient } from "~/data/getOAuthClient";

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

  const { CLERK_SECRET_KEY } = process.env;
  const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });
  const user = await clerkClient.users.getUser(userId);
  const oauth2Client = await getOAuthClient(user, clerkClient);

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
