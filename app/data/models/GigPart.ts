import { GigPartType } from "~/data/models/types";

export abstract class GigPart {
  public actualStart: string | null;
  public actualEnd: string | null;

  public constructor(
    public readonly type: GigPartType,
    public readonly startDateTime: string,
    public readonly endDateTime: string
  ) {
    this.actualStart = null;
    this.actualEnd = null;
  }
}
