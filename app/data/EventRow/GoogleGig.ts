import { calendar_v3 } from "googleapis";

import Gig from "~/data/Gig";

export default class GoogleGig extends Gig {
  public getRouteInfo() {
    return null
  }

  public getEventParts() {
    return null
  }

  static make(json: calendar_v3.Schema$Event) {
    return new GoogleGig(
      json.location!,
      json.start!.dateTime!,
      json.end!.dateTime!,
    )
  }
}
