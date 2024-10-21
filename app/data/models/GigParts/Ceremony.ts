import dayjs from "dayjs";

import { GigPart } from "~/data/models/GigParts/GigPart";

export class Ceremony extends GigPart {
  constructor(startDateTime: string, endDateTime: string) {
    super("ceremony", startDateTime, endDateTime);

    // const writtenStartDay = DayJsTz(startDateTime);
    const writtenStartDay = dayjs(startDateTime);
    const actualStartDay = writtenStartDay.subtract(30, "minutes");

    const actualStartDateTime = actualStartDay//.tz(TIME_ZONE);

    const actualStartDateTimeFormatted = actualStartDateTime.format()
      // remove time zone suffix
      .replace(/(:00)-0.*/, "$1");

    this.actualStartDateTime = actualStartDateTimeFormatted;
  }
}
