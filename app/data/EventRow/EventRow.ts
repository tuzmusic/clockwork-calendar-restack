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

  public static buildRow(emailGig: EmailGig, googleGig: GoogleGig, distanceService: DistanceService) {
    const row = new EventRow(emailGig, googleGig, distanceService);

    row.appGig = FullCalendarGig.makeFromValues(
      emailGig.getLocation(),
      emailGig.getStartTime().dateTime,
      emailGig.getEndTime().dateTime,
      false,
      distanceService
    );

    if (emailGig.getLocation() === googleGig.getLocation()) {
      const routeInfo = googleGig.getRouteInfo();
      if (routeInfo) {
        row.appGig.setRouteInfo(routeInfo);
      }
    }

    const parts = googleGig.getParts();
    if (parts) {
      row.appGig.setParts(parts);
    }

    return row;
  }
}
