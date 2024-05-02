import EmailGig from "~/data/EmailGig";
import GoogleGig from "~/data/EventRow/GoogleGig";
import FullCalendarGig from "~/data/FullCalendarGig";

export default class EventRow {
  private constructor(private emailGig: EmailGig, private googleGig: GoogleGig) {}

  public appGig!: FullCalendarGig

  public static buildRow(emailGig: EmailGig, googleGig: GoogleGig) {
    const row = new EventRow(emailGig, googleGig);

    row.appGig = FullCalendarGig.makeFromValues(
      emailGig.getLocation(),
      emailGig.getStartTime().dateTime,
      emailGig.getEndTime().dateTime,
      false
    )

    return row
  }
}
