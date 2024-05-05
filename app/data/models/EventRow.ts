import EmailGig from "~/data/models/EmailGig";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import GoogleGig from "~/data/models/GoogleGig";
import DistanceService from "~/data/services/DistanceService";

export default class EventRow {
  private constructor(
    private emailGig: EmailGig | undefined,
    private googleGig: GoogleGig | undefined,
    private distanceService: DistanceService
  ) {
  }

  public getCalendarGig() {
    return this.googleGig
  }

  public appGig!: FullCalendarGig;

  private get locationsMatch() {
    return this.emailGig?.getLocation() === this.googleGig?.getLocation();
  }

  public get locationHasChanged() {
    return !this.locationsMatch;
  }

  private get partsMatch() {
    const emailParts = this.emailGig?.getParts();
    const googleParts = this.googleGig?.getParts();
    return JSON.stringify(emailParts) === JSON.stringify(googleParts);
  }

  public get partsHaveChanged() {
    return !this.partsMatch;
  }

  private _hasChanged!: boolean

  public get hasChanged() {
    if (this._hasChanged === undefined) {
      this._hasChanged = !this.eventsAreIdentical
    }
    return this._hasChanged
  }

  private get eventsAreIdentical() {
    return this.locationsMatch && this.partsMatch;
  }

  public static buildRow(emailGig: EmailGig, googleGig: GoogleGig, distanceService: DistanceService): EventRow
  public static buildRow(emailGig: EmailGig, googleGig: undefined, distanceService: DistanceService): EventRow
  public static buildRow(emailGig: undefined, googleGig: GoogleGig, distanceService: DistanceService): EventRow
  public static buildRow(
    emailGig: EmailGig | undefined,
    googleGig: GoogleGig | undefined,
    distanceService: DistanceService
  ): EventRow {
    if (!emailGig && !googleGig) {
      throw new Error('buildRow was called but neither event is defined.')
    }

    if (!emailGig) {
      throw new Error('Unhandled: email gig is blank')
    }

    const row = new EventRow(emailGig, googleGig, distanceService);

    row.appGig = FullCalendarGig.makeFromValues({
      location: emailGig.getLocation(),
      startDateTimeStr: emailGig.getStartTime().dateTime,
      endDateTimeStr: emailGig.getEndTime().dateTime,
      parts: emailGig.getParts(),
      isNew: !googleGig,
      distanceService
    });

    if (googleGig && row.locationsMatch) {
      const routeInfo = googleGig.getRouteInfo();
      if (routeInfo) {
        row.appGig.setRouteInfo(routeInfo);
      }
    }

    return row;
  }
}
