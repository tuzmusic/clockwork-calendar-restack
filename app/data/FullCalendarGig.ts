import CalendarGig from "~/data/CalendarGig";
import CalendarService from "~/data/CalendarService";
import { LOCATIONS } from "~/data/constants";
import DistanceService from "~/data/DistanceService";
import { DistanceData } from "~/data/types";

export default class FullCalendarGig extends CalendarGig {
  protected constructor(location: string, startDateTimeStr: string, endDateTimeStr: string, isNew: boolean) {
    super(location, startDateTimeStr, endDateTimeStr, isNew);
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
      fromWaltham: await distanceService.getDistanceInfo({
        from: LOCATIONS.waltham,
        to: this.location
      }),
      // TODO (needs to deal with actual durations
      walthamDetour: {
        miles: 0,
        minutes: 30,
        formattedTime: "30m"
      },
      fromBoston: await distanceService.getDistanceInfo({
        from: LOCATIONS.boston,
        to: this.location
      }),
    };
  }

  public static async makeFromBasicCalendarGig(
    basicGig: CalendarGig,
    distanceService = new DistanceService()
  ) {
    const location = basicGig.getLocation();
    const startTime = basicGig.getStartTime().dateTime;
    const endTime = basicGig.getEndTime().dateTime;
    const isNew = basicGig.isNew;

    const newCalendarGig = new FullCalendarGig(
      location,
      startTime,
      endTime,
      isNew
    );

    await newCalendarGig.setRouteInfo(distanceService);

    return newCalendarGig;
  }

  public async store(calendarService = new CalendarService()) {
    await calendarService.post({
      location: this.location,
      start: this.getStartTime(),
      end: this.getEndTime()
    });
  }
}
