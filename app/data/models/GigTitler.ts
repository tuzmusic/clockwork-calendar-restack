import FullCalendarGig from "~/data/models/FullCalendarGig";

export default class GigTitler {
  distanceInfo: NonNullable<ReturnType<typeof this.gig["getDistanceInfo"]>>;

  constructor(private gig: FullCalendarGig) {
    // todo: handle it not being fetched yet.
    this.distanceInfo = gig.getDistanceInfo()!;
  }

  public getTime() {
    return "🚙" + (() => {
      const { formattedTime } = this.distanceInfo["fromHome"];
      if (!formattedTime.includes("m")) {
        return formattedTime;
      }
      if (!formattedTime.includes("h")) {
        return formattedTime;
      }
      return formattedTime.replace("h", ":").replace("m", "");
    })();
  }
}
