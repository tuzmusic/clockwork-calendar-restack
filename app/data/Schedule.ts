import BasicCalendarGig from "~/data/BasicCalendarGig";
import EmailGig from "~/data/EmailGig";

export default class Schedule {
  private emailGigsTable: Record<string, EmailGig>;
  private calendarGigsTable: Record<string, BasicCalendarGig>;

  private constructor(private emailGigs: EmailGig[], private calendarGigs: BasicCalendarGig[]) {
    this.emailGigsTable = emailGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});

    this.calendarGigsTable = calendarGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  public static build(arrays: { emailGigs: EmailGig[]; calendarGigs: BasicCalendarGig[]; }) {
    const schedule = new Schedule(arrays.emailGigs, arrays.calendarGigs);
    return schedule;
  }

  public async getEventSets() {
    const promises = Object.keys(this.emailGigsTable).map(async (id) => {
      const emailGig = this.emailGigsTable[id];
      const calendarGig = this.calendarGigsTable[id] ?? await BasicCalendarGig.makeFromEmailGig(
        emailGig
      );

      return ({
        emailGig,
        calendarGig
      });
    });

    return await Promise.all(promises);
  }
}
