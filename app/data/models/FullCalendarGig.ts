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

interface MakeFnArgs {
  location: string,
  parts: GigPart[] | null,
  distanceService?: DistanceService
  isNew?: boolean
  googleId?: string
}

export type FullCalendarGigJson = ReturnType<FullCalendarGig["serialize"]>

export default class FullCalendarGig extends GigWithParts {
  private distanceService: DistanceService;
  private readonly googleId: string | null;

  public getGoogleId() {
    return this.googleId;
  }

  public static deserialize(gigJson: FullCalendarGigJson): FullCalendarGig {
    const makeParts = (partsJson: FullCalendarGigJson['parts']) => partsJson.map(json => {
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
    });

    const gig = this.make({
      location: gigJson.location,
      googleId: gigJson.googleId ?? undefined,
      parts: makeParts(gigJson.parts)
    });

    // todo: would be good to include this in .make but...
    gig._distanceInfo = gigJson.distanceInfo

    return gig;
  }

  public static make({
      location,
      parts,
      distanceService = new DistanceService(),
      isNew = false,
      googleId
    }: MakeFnArgs
  ) {
    return new FullCalendarGig({
        location,
        parts,
        distanceService,
        googleId
      },
      isNew
    );
  }

  protected constructor({ location, parts, distanceService, googleId }: {
    location: string,
    parts?: GigPart[] | null,
    distanceService: DistanceService
    googleId?: string
  }, public readonly isNew: boolean) {
    super(location, parts ?? []);
    this.googleId = googleId ?? null;
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

    // todo: simplify this with a mapped object
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
        dayjs.duration(
          withWaltham.minutes - fromHome.minutes, "minutes"
        ))
    };

    const fromWaltham = await distanceService.getDistanceInfo({
      from: LOCATIONS.waltham,
      to: this.location
    });

    const fromBoston = await distanceService.getDistanceInfo({
      from: LOCATIONS.boston,
      to: this.location
    });

    this._distanceInfo = {
      fromHome,
      withWaltham,
      walthamDetour,
      fromWaltham,
      fromBoston
    };
  }

  public serialize() {
    return {
      ...super.serialize(), // includes parts
      googleId: this.googleId,
      distanceInfo: this._distanceInfo,
      startTime: this.getStartTime(),
      endTime: this.getEndTime()
    };
  }

  private makePayload() {
    return {
      location: this.location,
      summary: this.getEventTitle(),
      start: timeObj(this.getStartTime()),
      end: timeObj(this.getEndTime()),
      extendedProperties: {
        private: {
          distanceInfo: JSON.stringify(this.getDistanceInfo())
        }
      }
    };
  }

  public async update(calendarService = new CalendarService()) {
    return await calendarService.updateEvent(this.googleId, this.makePayload());
  }

  public async store(calendarService = new CalendarService()) {
    return await calendarService.postEvent(this.makePayload());
  }

// TODO: "encode" event details in event name so it can be
//  better understood at a glance
  private getEventTitle() {
    return "Clockwork Gig";
  }
}
