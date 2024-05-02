import EmailGig from "~/data/EmailGig";
import GoogleGig from "~/data/EventRow/GoogleGig";

export default class EventRow {
  private constructor(private emailGig: EmailGig, private googleGig: GoogleGig) {}

  // public readonly appGig:

  public static buildRow(emailGig: EmailGig, googleGig: GoogleGig) {
    const row = new EventRow(emailGig, googleGig);

  }
}
