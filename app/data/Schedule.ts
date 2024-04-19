import CalendarGig from "~/data/CalendarGig";
import EmailGig from "~/data/EmailGig";

export default class Schedule {
  private emailGigsTable: Record<string, EmailGig>;
  private calendarGigsTable: Record<string, CalendarGig>;

  private constructor(private emailGigs: EmailGig[], private calendarGigs: CalendarGig[]) {
    this.emailGigsTable = emailGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});

    this.calendarGigsTable = calendarGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  public static build(arrays: { emailGigs: EmailGig[]; calendarGigs: CalendarGig[]; }) {
    const schedule = new Schedule(arrays.emailGigs, arrays.calendarGigs);
    return schedule;
  }

  public getEventSets() {
    return Object.keys(this.emailGigsTable).map((id) => {
      const emailGig = this.emailGigsTable[id];
      const calendarGig = this.calendarGigsTable[id] ?? CalendarGig.make(
     emailGig,
        { isNew: true }
      );

      return ({
        emailGig,
        calendarGig
      });
    });
  }
}
