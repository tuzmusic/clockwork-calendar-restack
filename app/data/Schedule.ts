import CalendarGig from "~/data/CalendarGig";
import EmailGig from "~/data/EmailGig";

export default class Schedule {
  private emailGigsTable: Record<string, EmailGig>;
  private remoteGigsTable: Record<string, CalendarGig>;

  private constructor(private emailGigs: EmailGig[], private remoteGigs: CalendarGig[]) {
    this.emailGigsTable = emailGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});

    this.remoteGigsTable = remoteGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  public static build(arrays: { emailGigs: EmailGig[]; remoteGigs: CalendarGig[]; }) {
    const schedule = new Schedule(arrays.emailGigs, arrays.remoteGigs);
    return schedule;
  }

  public async getEventSets() {
    const promises = Object.keys(this.emailGigsTable).map(async (id) => {
      const emailGig = this.emailGigsTable[id];
      const remoteGig = this.remoteGigsTable[id] ?? await CalendarGig.makeFromEmailGig(
        emailGig
      );

      return ({
        emailGig,
        remoteGig
      });
    });

    return await Promise.all(promises);
  }
}
