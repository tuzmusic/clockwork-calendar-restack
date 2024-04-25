import { calendar_v3 } from "googleapis";

import { LOCATIONS } from "~/data/constants";
import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";
import { DistanceData } from "~/data/types";

export default class BasicCalendarGig extends Gig {
  private readonly _isNew: boolean;
  public get isNew() {
    return this._isNew;
  }

  private _routeInfo!: Record<string, DistanceData>;

  public getRouteInfo() {
    return this._routeInfo;
  }

  private async setRouteInfo(distanceService: DistanceService) {
    this._routeInfo = {
      withWaltham: await distanceService.getDistanceInfo({
        from: LOCATIONS.home,
        to: this.location,
        through: LOCATIONS.waltham
      }),
      fromHome: await distanceService.getDistanceInfo({
        from: LOCATIONS.home,
        to: this.location
      }),
      fromWaltham: {
        miles: 0,
        minutes: 45,
        formattedTime: "45m"
      },
      walthamDetour: {
        miles: 0,
        minutes: 30,
        formattedTime: "30m"
      },
      fromBoston: {
        miles: 65,
        minutes: 70,
        formattedTime: "1h 10m"
      }
    };

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

    const newCalendarGig = new BasicCalendarGig(
      location,
      startTime,
      endTime,
      true
    );

    await newCalendarGig.setRouteInfo(distanceService);

    return newCalendarGig;
  }

  public static makeFromExisting(
    location: string,
    startDateTimeStr: string,
    endDateTimeStr: string
  ) {
    return new this(location, startDateTimeStr, endDateTimeStr, false);
  }

  public static  makeFromRemoteExisting(googleCalendarObject: calendar_v3.Schema$Event): BasicCalendarGig {
    return BasicCalendarGig.makeFromExisting(
      googleCalendarObject.location!,
      googleCalendarObject.start!.dateTime!,
      googleCalendarObject.end!.dateTime!,
    )
  }
}
