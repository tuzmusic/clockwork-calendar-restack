import CalendarGig from "~/data/CalendarGig";
import EmailGig from "~/data/EmailGig";

export default class Schedule {
  private constructor(private emailGigs: EmailGig[], private calendarGigs: CalendarGig[]) {
  }

  public static build(arrays: { emailGigs: EmailGig[]; calendarGigs: CalendarGig[]; }) {
    return new Schedule(arrays.emailGigs, arrays.calendarGigs);
  }
}
