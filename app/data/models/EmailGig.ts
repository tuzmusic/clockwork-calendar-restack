import Gig from "~/data/models/Gig";
import { GigPart } from "~/data/models/GigParts/GigPart";

export default class EmailGig extends Gig {
  static make(location: string, parts: GigPart[]) {
    return new this(location, parts);
  }
}
