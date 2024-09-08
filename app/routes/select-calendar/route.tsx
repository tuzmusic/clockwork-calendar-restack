import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { selectedCalendarCookie } from "~/auth/cookies.server";
import AccountService from "~/data/services/AccountService";

dayjs.extend(timezone);
dayjs.extend(utc);

const CALENDAR_ID_KEY = "calendarId";

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: store selected calendar
  const cookieHeader = request.headers.get("Cookie");
  const calendarId = await selectedCalendarCookie.parse(cookieHeader);
  if (calendarId) throw redirect("/email");

  const list = await AccountService.getCalendarList(request);
  return json(list);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const calendarId = formData.get(CALENDAR_ID_KEY);
  return redirect("/email", {
    headers: {
      "Set-Cookie": await selectedCalendarCookie.serialize(calendarId)
    }
  });
}


const SelectCalendar = () => {
  const calendars = useLoaderData<typeof loader>();

  return <div className={"p-5"}>
    <h1 className={"font-bold"}>Select Calendar</h1>
    <form method="post">
      <ul>
        {calendars.map(cal =>
          <li key={cal.id}>
            <button
              type="submit"
              value={cal.id ?? ""}
              name={CALENDAR_ID_KEY}
              className={"underline text-blue-700"}>
              {cal.summaryOverride ?? cal.summary}
            </button>
          </li>)}
      </ul>
    </form>
  </div>;
};

export default SelectCalendar;
