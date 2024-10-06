import { calendar_v3 } from "googleapis";

import { GigPartJSON } from "~/data/models/GigParts/GigPart";
import SimpleGig, { SimpleGigJson } from "~/data/models/SimpleGig";
import { DistanceData } from "~/data/models/types";

export default class GoogleGig extends SimpleGig<{
  startDateTime: string,
  endDateTime: string
}> {
  private readonly distanceInfo: Record<string, DistanceData> | null = null;
  private readonly partsJson: GigPartJSON[] | null = null;

  public getDistanceInfo() {
    return this.distanceInfo;
  }

  public getPartsJson() {
    return this.partsJson;
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
        this.distanceInfo = JSON.parse(extendedProps.distanceInfo);
      }
      if (extendedProps.parts) {
        this.partsJson = JSON.parse(extendedProps.parts) as GigPartJSON[];
      }
    }
  }

  static make(json: calendar_v3.Schema$Event) {
    return new GoogleGig(json);
  }

  public override serialize(): { startDateTime: string; endDateTime: string } & SimpleGigJson {
    return {
      id: this.id,
      location: this.location,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime
    };
  }
}
