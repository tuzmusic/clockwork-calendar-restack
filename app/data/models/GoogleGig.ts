import { calendar_v3 } from "googleapis";

import { Ceremony } from "~/data/models/GigParts/Ceremony";
import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigPart, GigPartJSON } from "~/data/models/GigParts/GigPart";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";
import { Reception } from "~/data/models/GigParts/Reception";
import SimpleGig from "~/data/models/SimpleGig";
import { DistanceData } from "~/data/models/types";

export default class GoogleGig extends SimpleGig {
  private routeInfo: Record<string, DistanceData> | null = null;
  public readonly partsJson: GigPartJSON[] | null = null;

  public getRouteInfo() {
    return this.routeInfo;
  }

  private constructor(private googleJson: calendar_v3.Schema$Event) {
    super(
      googleJson.location!,
      googleJson.start!.dateTime!,
      googleJson.end!.dateTime!
    );
    const extendedProps = googleJson.extendedProperties?.private;

    if (extendedProps) {
      if (extendedProps.distanceInfo) {
        this.routeInfo = JSON.parse(extendedProps.distanceInfo);
      }
      if (extendedProps.parts) {
        this.partsJson = JSON.parse(extendedProps.parts) as GigPartJSON[];
      }
    }
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

    return GigTimeline.make(parts);
  }


  static make(json: calendar_v3.Schema$Event) {
    return new GoogleGig(json);
  }
}
