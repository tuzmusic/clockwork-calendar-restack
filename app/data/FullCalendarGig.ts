import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import CalendarGig from "~/data/CalendarGig";
import CalendarService from "~/data/CalendarService";
import { LOCATIONS } from "~/data/constants";
import DistanceService from "~/data/DistanceService";
import { DistanceData } from "~/data/types";
import { formatDuration } from "~/data/utilityFunctions";

dayjs.extend(duration);

export default class FullCalendarGig extends CalendarGig {
  private distanceService: DistanceService;

  protected constructor({ location, startDateTimeStr, endDateTimeStr, isNew, distanceService }: {
    location: string,
    startDateTimeStr: string,
    endDateTimeStr: string,
    isNew: boolean,
    distanceService: DistanceService
  }) {
    super(location, startDateTimeStr, endDateTimeStr, isNew);
    this.distanceService = distanceService;
  }

  private _routeInfo!: Record<string, DistanceData>;

  public getRouteInfo() {
    return this._routeInfo;
  }

  private async setRouteInfo() {
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

    const newCalendarGig = new FullCalendarGig(
      { location, startDateTimeStr: startTime, endDateTimeStr: endTime, isNew, distanceService }
    );

    await newCalendarGig.setRouteInfo();

    return newCalendarGig;
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
