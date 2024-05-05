import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import GoogleGig from "~/data/EventRow/GoogleGig";
import FullCalendarGig from "~/data/FullCalendarGig";

export default class EventRow {
  private constructor(
    private emailGig: EmailGig,
    private googleGig: GoogleGig,
    private distanceService: DistanceService
  ) {
  }

  public appGig!: FullCalendarGig;

  private get locationsMatch() {
    return this.emailGig.getLocation() === this.googleGig.getLocation();
  }

  public get locationHasChanged() {
    return !this.locationsMatch;
  }

  private get partsMatch() {
    const emailParts = this.emailGig.getParts();
    const googleParts = this.googleGig.getParts();
    return JSON.stringify(emailParts) === JSON.stringify(googleParts);
  }


  public get partsHaveChanged() {
    return !this.partsMatch;
  }

  // todo: make normal accessor
  public get hasChanged() {
    return !this.eventsAreIdentical;
  }

  private get eventsAreIdentical() {
    return this.locationsMatch && this.partsMatch;
  }

  public static buildRow(emailGig: EmailGig, googleGig: GoogleGig, distanceService: DistanceService) {
    const row = new EventRow(emailGig, googleGig, distanceService);

    row.appGig = FullCalendarGig.makeFromValues({
      location: emailGig.getLocation(),
      startDateTimeStr: emailGig.getStartTime().dateTime,
      endDateTimeStr: emailGig.getEndTime().dateTime,
      isNew: false,
      parts: emailGig.getParts(),
      distanceService
    });

    if (emailGig.getLocation() === googleGig.getLocation()) {
      const routeInfo = googleGig.getRouteInfo();
      if (routeInfo) {
        row.appGig.setRouteInfo(routeInfo);
      }
    }

    return row;
  }
}
