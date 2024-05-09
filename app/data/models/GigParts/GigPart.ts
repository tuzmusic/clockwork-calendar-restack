import { GigPartType } from "~/data/models/types";

export abstract class GigPart {
  public actualStartDateTime: string | null;
  public actualEndDateTime: string | null;

  public constructor(
    public readonly type: GigPartType,
    public readonly startDateTime: string,
    public readonly endDateTime: string
  ) {
    this.actualStartDateTime = startDateTime;
    this.actualEndDateTime = endDateTime;
  }
}
