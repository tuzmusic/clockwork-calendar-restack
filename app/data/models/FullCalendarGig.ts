import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { LOCATIONS } from "~/data/models/constants";
import { Ceremony } from "~/data/models/GigParts/Ceremony";
import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigPart } from "~/data/models/GigParts/GigPart";
import { Reception } from "~/data/models/GigParts/Reception";
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

export type FullCalendarGigJson = ReturnType<FullCalendarGig["serialize"]>

export default class FullCalendarGig extends GigWithParts {
  private distanceService: DistanceService;

  public static deserialize(gigJson: FullCalendarGigJson): FullCalendarGig {
    return this.make({
      location: gigJson.location,
      parts: gigJson.parts.map(json => {
        const { type, startDateTime, endDateTime } = json;
        const ctor = (() => {
          switch (type) {
            case "cocktail hour":
              return CocktailHour;
            case "ceremony":
              return Ceremony;
            case "reception":
              return Reception;
          }
        })();

        return new ctor(startDateTime, endDateTime);
      })
    });
  }

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

  public getDistanceInfo() {
    return this._distanceInfo;
  }

  public setDistanceInfo(distanceInfo: Record<string, DistanceData>) {
    this._distanceInfo = distanceInfo;
  }

  public async fetchDistanceInfo() {
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

  public serialize() {
    return {
      ...super.serialize(), // includes parts
      distanceInfo: this._distanceInfo
    };
  }

  public async store(calendarService = new CalendarService()) {
    return await calendarService.postEvent({
      location: this.location,
      summary: 'Clockwork Gig',
      start: timeObj(this.getStartTime()),
      end: timeObj(this.getEndTime()),
      extendedProperties: {
        private: {
          distanceInfo: JSON.stringify(this.getDistanceInfo())
        }
      }
    });
  }
}
