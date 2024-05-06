import dayjs from "dayjs";

import { TimeObj } from "~/data/models/types";

export default class DateTime {
  public static makeGoogleDateFromTime(timeStr: string, dateParts: { date: number, month: string, year: number }) {
    const { date, month, year } = dateParts;

    // we assume that all events start after 1pm,
    // and that all events end before 1am,
    // and therefore "12" represents the midnight hour of the next day.
    const [_hour, minute] = timeStr.split(":");
    const hour = Number(_hour);
    const am = hour === 12;
    const actualDate = date + (am ? 1 : 0);

    // month is a string (i.e., 'July'), plus dates are easy
    const dateStr = dayjs(`${month} ${actualDate} ${year}`).format("YYYY-MM-DD");

    const hour24 = hour === 12 ? 0 : hour + 12;
    const hourStr = hour24.toString().padStart(2, "0");
    const finalDateStr = `${dateStr}T${hourStr}:${minute}:00-04:00`;

    return {
      dateTime: finalDateStr,
      timeZone: "America/New_York"
    } satisfies TimeObj;
  }

}
