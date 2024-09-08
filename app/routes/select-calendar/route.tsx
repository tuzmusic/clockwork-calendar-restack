import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { selectedCalendarCookie } from "~/auth/cookies.server";
import AccountService from "~/data/services/AccountService";

dayjs.extend(timezone)
dayjs.extend(utc)

export async function loader ({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const calendarId = await selectedCalendarCookie.parse(cookieHeader)
  if (calendarId) throw redirect('/email')

  // TODO part of a service?
  const list = await AccountService.getCalendarList(request)
  return json(list)
}

const SelectCalendar = () => {
  const calendars = useLoaderData<typeof loader>()
  return <div className={'p-5'}>
    <h1 className={'font-bold'}>Select Calendar</h1>
    <ul>
      {calendars.map(cal => <li key={cal.id}>
        <a className={'underline text-blue-700'} href={`/selectedCalendar/${cal.id}`}>
          {cal.summaryOverride ?? cal.summary}
        </a>
      </li>)}
    </ul>
  </div>
}

export default SelectCalendar
