import EmailGig from "~/data/models/EmailGig";
import EventRow from "~/data/models/EventRow";
import Gig from "~/data/models/Gig";
import GoogleGig from "~/data/models/GoogleGig";
import DistanceService from "~/data/services/DistanceService";

export default class Schedule {
  private readonly emailGigsTable: Record<string, EmailGig>;
  private readonly remoteGigsTable: Record<string, GoogleGig>;
  public readonly eventSets: EventRow[];

  private makeTableById<T extends Gig>(gigs: T[]): Record<string, T> {
    return gigs.reduce((acc, gig) => ({
      ...acc, [gig.getId()]: gig
    }), {});
  }

  private constructor(
    private emailGigs: EmailGig[],
    private remoteGigs: GoogleGig[],
    private distanceService: DistanceService
  ) {
    this.emailGigsTable = this.makeTableById(emailGigs);
    this.remoteGigsTable = this.makeTableById(remoteGigs);
    this.eventSets = this.getEventSets();
  }

  public static build(arrays: { emailGigs: EmailGig[]; remoteGigs: GoogleGig[]; }, distanceService: DistanceService) {
    return new Schedule(arrays.emailGigs, arrays.remoteGigs, distanceService);
  }

  private getEventSets() {
    const rowsFromEmailGigs = Object.keys(this.emailGigsTable).map(id => {
      const emailGig = this.emailGigsTable[id];
      const remoteGig = this.remoteGigsTable[id];
      return EventRow.buildRow(emailGig, remoteGig, this.distanceService);
    });

    // todo: find orphaned calendar gigs

    return rowsFromEmailGigs;
  }
}
