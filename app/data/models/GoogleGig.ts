import { calendar_v3 } from "googleapis";

import Gig from "~/data/models/Gig";
import { Reception } from "~/data/models/GigParts/Reception";
import { DistanceData } from "~/data/models/types";

export default class GoogleGig extends Gig {
  private routeInfo: Record<string, DistanceData> | null = null;

  public getRouteInfo() {
    return this.routeInfo;
  }

  public getEventParts() {
    return null;
  }

  public getStartTime(): string {
    return this.dateTime.start;
  }

  private constructor(location: string, start: string, end: string) {
    const fakePart = new Reception(start, end);
    super(location, [fakePart]);
  }

  private makeParts(json: any) {

  }

  static make(json: calendar_v3.Schema$Event) {
    const gig = new GoogleGig(
      json.location!,
      json.start!.dateTime!,
      json.end!.dateTime!
    );

    const extendedProps = json.extendedProperties?.private;

    if (extendedProps) {
      if (extendedProps.distanceInfo) {
        gig.routeInfo = JSON.parse(extendedProps.distanceInfo);
      }
      if (extendedProps.parts) {
        gig.timeline = JSON.parse(extendedProps.parts);
      }
    }

    return gig;
  }
}
