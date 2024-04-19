import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";

export default class CalendarGig extends Gig {
  private _isNew: boolean;
  public get isNew() {
    return this._isNew;
  }

  private constructor(location: string, startDateTimeStr: string, endDateTimeStr: string, isNew: boolean) {
    super(location, startDateTimeStr, endDateTimeStr);
    this._isNew = isNew;
  }

  public static make(
    emailGig: EmailGig,
    { isNew = false }: { isNew: boolean } = { isNew: false }
  ) {
    return new this(
      emailGig.getLocation(),
      emailGig.getStartTime().dateTime,
      emailGig.getEndTime().dateTime,
      isNew
    );
  }
}
