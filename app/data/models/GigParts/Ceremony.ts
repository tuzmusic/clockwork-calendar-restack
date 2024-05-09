import { TIME_ZONE } from "~/data/models/constants";
import DayJsTz from "~/data/models/DayJsTz";
import { GigPart } from "~/data/models/GigParts/GigPart";

export class Ceremony extends GigPart {
  constructor(startDateTime: string, endDateTime: string) {
    super("ceremony", startDateTime, endDateTime);

    const writtenStartDay = DayJsTz(startDateTime);
    const actualStartDay = writtenStartDay.subtract(30, "minutes");
    this.actualStart = actualStartDay.tz(TIME_ZONE).format();
  }
}
