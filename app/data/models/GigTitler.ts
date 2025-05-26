import dayjs from "dayjs";

import FullCalendarGig from "~/data/models/FullCalendarGig";

export default class GigTitler {
  distanceInfo: NonNullable<ReturnType<typeof this.gig["getDistanceInfo"]>>;

  constructor(private gig: FullCalendarGig) {
    // todo: handle it not being fetched yet.
    this.distanceInfo = gig.getDistanceInfo()!;
  }

  public getTimeFromHomeStr() {
    return "🚙" + (() => {
      const { formattedTime, minutes } = this.distanceInfo["fromHome"];
      if (!formattedTime.includes("m")) {
        return formattedTime;
      }
      if (!formattedTime.includes("h")) {
        return formattedTime;
      }

      return dayjs.duration(minutes, "minutes").format("H:mm");
    })();
  }

  public getHotelStr() {
    if (this.distanceInfo['fromBoston'].minutes >= 120) {
      return '🏩'
    }
    return null
  }
}
