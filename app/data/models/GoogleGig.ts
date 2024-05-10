import { calendar_v3 } from "googleapis";

import Gig from "~/data/models/Gig";
import { Ceremony } from "~/data/models/GigParts/Ceremony";
import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigPart, GigPartJSON } from "~/data/models/GigParts/GigPart";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";
import { Reception } from "~/data/models/GigParts/Reception";
import { DistanceData } from "~/data/models/types";

export default class GoogleGig extends Gig {
  private routeInfo: Record<string, DistanceData> | null = null;

  public getRouteInfo() {
    return this.routeInfo;
  }

  private constructor(location: string, start: string, end: string) {
    const fakePart = new Reception(start, end);

    // If the json has parts, they will overwrite this
    // todo: this implies that that logic should probably happen in the ctor
    super(location, [fakePart]);
  }

  private makePartsFromJson(partsJson: GigPartJSON[]) {
    const parts: GigPart[] = partsJson.map(json => {
      switch (json.type) {
        case "ceremony":
          return new Ceremony(json.startDateTime, json.endDateTime);
        case "cocktail hour":
          return new CocktailHour(json.startDateTime, json.endDateTime);
        case "reception":
          return new Reception(json.startDateTime, json.endDateTime);
      }
    });

    return GigTimeline.make(parts)
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
        const partsJson = JSON.parse(extendedProps.parts) as GigPartJSON[];
        gig.timeline = gig.makePartsFromJson(partsJson);
      }
    }

    return gig;
  }
}
