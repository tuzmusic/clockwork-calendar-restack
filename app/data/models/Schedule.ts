import EmailGig from "~/data/models/EmailGig";
import EventRow from "~/data/models/EventRow";
import GoogleGig from "~/data/models/GoogleGig";
import DistanceService from "~/data/services/DistanceService";

export default class Schedule {
  private readonly emailGigsTable: Record<string, EmailGig>;
  private readonly remoteGigsTable: Record<string, GoogleGig>;

  private constructor(
    private emailGigs: EmailGig[],
    private remoteGigs: GoogleGig[],
    private distanceService: DistanceService
  ) {
    this.emailGigsTable = emailGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});

    this.remoteGigsTable = remoteGigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  public static build(arrays: { emailGigs: EmailGig[]; remoteGigs: GoogleGig[]; }, distanceService: DistanceService) {
    const schedule = new Schedule(arrays.emailGigs, arrays.remoteGigs, distanceService);
    return schedule;
  }

  public getEventSets() {
    const rowsFromEmailGigs = Object.keys(this.emailGigsTable).map(id => {
      const emailGig = this.emailGigsTable[id];
      const remoteGig = this.remoteGigsTable[id];
      return EventRow.buildRow(emailGig, remoteGig, this.distanceService)
    })

    // todo: find orphaned calendar gigs

    return rowsFromEmailGigs
  }
}
