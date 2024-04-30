import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import FullCalendarGig from "~/data/FullCalendarGig";

interface EventSet {
  emailGig: EmailGig,
  remoteGig: CalendarGig,
  calendarGig: FullCalendarGig
}

export default class Schedule {
  private emailGigsTable: Record<string, EmailGig>;
  private remoteGigsTable: Record<string, CalendarGig>;

  private constructor(
    private emailGigs: EmailGig[],
    private remoteGigs: CalendarGig[],
    private distanceService: DistanceService
  ) {
    this.emailGigsTable = emailGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});

    this.remoteGigsTable = remoteGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  public static build(arrays: { emailGigs: EmailGig[]; remoteGigs: CalendarGig[]; }, distanceService: DistanceService) {
    const schedule = new Schedule(arrays.emailGigs, arrays.remoteGigs, distanceService);
    return schedule;
  }

  public async getEventSets() {
    const promises = Object.keys(this.emailGigsTable).map(async (id) => {
      const emailGig = this.emailGigsTable[id];
      const remoteGig = this.remoteGigsTable[id];
      const calendarGig = await EmailGig.makeFullCalendarGig(
        emailGig, this.distanceService
      );

      return {
        emailGig,
        remoteGig,
        calendarGig
      } satisfies EventSet;
    });

    return await Promise.all(promises);
  }
}
