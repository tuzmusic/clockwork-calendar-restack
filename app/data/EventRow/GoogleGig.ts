import { calendar_v3 } from "googleapis";

import Gig from "~/data/Gig";
import { DistanceData } from "~/data/types";

export default class GoogleGig extends Gig {
  private routeInfo: Record<string, DistanceData> | null = null;

  public getRouteInfo() {
    return this.routeInfo;
  }

  public getEventParts() {
    return null;
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
    }

    return gig;
  }
}
