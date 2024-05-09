import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import CalendarGig from "~/data/models/CalendarGig";
import { LOCATIONS } from "~/data/models/constants";
import { DistanceData, EventPart } from "~/data/models/types";
import { formatDuration } from "~/data/models/utilityFunctions";
import CalendarService from "~/data/services/CalendarService";
import DistanceService from "~/data/services/DistanceService";

dayjs.extend(duration);

export default class FullCalendarGig extends CalendarGig {
  private distanceService: DistanceService;

  public static makeFromValues(
    { location, startDateTimeStr, endDateTimeStr, parts, isNew, distanceService = new DistanceService() }: {
      location: string,
      startDateTimeStr: string,
      endDateTimeStr: string,
      isNew: boolean,
      parts?: EventPart[] | null,
      distanceService?: DistanceService
    }
  ) {
    return new FullCalendarGig({
      location,
      startDateTimeStr,
      endDateTimeStr,
      isNew,
      parts,
      distanceService
    });
  }


  protected constructor({ location, startDateTimeStr, endDateTimeStr, parts, isNew, distanceService }: {
    location: string,
    startDateTimeStr: string,
    endDateTimeStr: string,
    parts?: EventPart[] | null,
    isNew: boolean,
    distanceService: DistanceService
  }) {
    super(location, startDateTimeStr, endDateTimeStr, isNew);
    this.timeline = parts ?? [];
    this.distanceService = distanceService;
  }

  private _routeInfo: Record<string, DistanceData> | null = null;

  public getRouteInfo() {
    return this._routeInfo;
  }

  public setRouteInfo(routeInfo: Record<string, DistanceData>) {
    this._routeInfo = routeInfo;
  }

  public async fetchRouteInfo() {
    if (this._routeInfo) return this._routeInfo;

    const { distanceService } = this;
    const fromHome = await distanceService.getDistanceInfo({
      from: LOCATIONS.home,
      to: this.location
    });

    const withWaltham = await distanceService.getDistanceInfo({
      from: LOCATIONS.home,
      to: this.location,
      through: LOCATIONS.waltham
    });

    const walthamDetour = {
      miles: withWaltham.miles - fromHome.miles,
      minutes: withWaltham.minutes - fromHome.minutes,
      formattedTime: formatDuration(
        dayjs.duration(withWaltham.minutes - fromHome.minutes, "minutes")
      )
    };

    this._routeInfo = {
      fromHome,
      withWaltham,
      walthamDetour,
      fromWaltham: await distanceService.getDistanceInfo({
        from: LOCATIONS.waltham,
        to: this.location
      }),
      fromBoston: await distanceService.getDistanceInfo({
        from: LOCATIONS.boston,
        to: this.location
      })
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

    return new FullCalendarGig(
      { location, startDateTimeStr: startTime, endDateTimeStr: endTime, isNew, distanceService }
    );
  }

  public async store(calendarService = new CalendarService()) {
    await calendarService.post({
      location: this.location,
      start: this.getStartTime(),
      end: this.getEndTime(),
      extendedProperties: {
        private: {
          distanceInfo: JSON.stringify(this.getRouteInfo())
        }
      }
    });
  }
}
