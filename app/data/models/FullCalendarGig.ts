import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { LOCATIONS } from "~/data/models/constants";
import { GigPart } from "~/data/models/GigParts/GigPart";
import GigWithParts from "~/data/models/GigWithParts";
import { DistanceData, timeObj } from "~/data/models/types";
import { formatDuration } from "~/data/models/utilityFunctions";
import CalendarService from "~/data/services/CalendarService";
import DistanceService from "~/data/services/DistanceService";

dayjs.extend(duration);

interface MakeFromValues {
  location: string,
  parts: GigPart[] | null,
  distanceService?: DistanceService
  isNew?: boolean
}

export default class FullCalendarGig extends GigWithParts {
  private distanceService: DistanceService;

  public static make({
                       location,
                       parts,
                       distanceService = new DistanceService(),
                       isNew = false
                     }: MakeFromValues
  ) {
    return new FullCalendarGig({
        location,
        parts,
        distanceService
      },
      isNew
    );
  }

  protected constructor({ location, parts, distanceService }: {
    location: string,
    parts?: GigPart[] | null,
    distanceService: DistanceService
  }, public readonly isNew: boolean) {
    super(location, parts ?? []);
    this.distanceService = distanceService;
  }

  private _distanceInfo: Record<string, DistanceData> | null = null;

  public getRouteInfo() {
    return this._distanceInfo;
  }

  public setRouteInfo(distanceInfo: Record<string, DistanceData>) {
    this._distanceInfo = distanceInfo;
  }

  public async fetchRouteInfo() {
    if (this._distanceInfo) return this._distanceInfo;

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

    this._distanceInfo = {
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

  public async store(calendarService = new CalendarService()) {
    await calendarService.post({
      location: this.location,
      start: timeObj(this.getStartTime()),
      end: timeObj(this.getEndTime()),
      extendedProperties: {
        private: {
          distanceInfo: JSON.stringify(this.getRouteInfo())

        }
      }
    });
  }
}
