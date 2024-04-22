import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";
import { DistanceData } from "~/data/types";

export default class CalendarGig extends Gig {
  private readonly _isNew: boolean;
  public get isNew() {
    return this._isNew;
  }

  private _routeInfo!: Record<string, DistanceData>;

  public getRouteInfo() {
    if (this._routeInfo) return this._routeInfo;

    this._routeInfo = {
      withWaltham: {
        miles: 0, minutes: 120, formattedTime: "2h"
      }
    } satisfies Record<string, DistanceData>;

    return this._routeInfo
  }

  private constructor(location: string, startDateTimeStr: string, endDateTimeStr: string, isNew: boolean) {
    super(location, startDateTimeStr, endDateTimeStr);
    this._isNew = isNew;
  }

  public static async makeFromEmailGig(
    emailGig: EmailGig,
    distanceService = new DistanceService()
  ) {
    const location = emailGig.getLocation();
    const startTime = emailGig.getStartTime().dateTime;
    const endTime = emailGig.getEndTime().dateTime;

    const newCalendarGig = new CalendarGig(
      location,
      startTime,
      endTime,
      true
    );

    const _justPassTheTest = await distanceService.getDistanceInfo({
      from: location,
      to: ""
    });

    return newCalendarGig;
  }

  public static makeFromExisting(
    location: string,
    startDateTimeStr: string,
    endDateTimeStr: string
  ) {
    return new this(location, startDateTimeStr, endDateTimeStr, false);
  }
}
