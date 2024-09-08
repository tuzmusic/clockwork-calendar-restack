import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { selectedCalendarCookie } from "~/auth/cookies.server";

dayjs.extend(timezone)
dayjs.extend(utc)

export async function loader ({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const calendarId = await selectedCalendarCookie.parse(cookieHeader)
  if (calendarId) throw redirect('/email')

  // TODO part of a service?
  const list = await getCalendarList(cookieHeader)
  return json(list?.data.items ?? [])
}

const SelectCalendar = () => {
  const calendars = useLoaderData<typeof loader>()
  return <>
    <h1>Select Calendar</h1>
    <ul>
      {calendars.map(cal => <li key={cal.id}>
        <a href={`/selectedCalendar/${cal.id}`}>
          {cal.summaryOverride ?? cal.summary}
        </a>
      </li>)}
    </ul>
    <div><Link to={'/login'}>Login</Link></div>
    <div><Link to={'/email'}>Email</Link></div>
  </>
}

export default SelectCalendar
