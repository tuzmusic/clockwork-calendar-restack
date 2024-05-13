import { GigPart } from "~/data/models/GigParts/GigPart";
import GigWithParts from "~/data/models/GigWithParts";

export default class EmailGig extends GigWithParts {
  static make(location: string, parts: GigPart[]) {
    return new this(location, parts);
  }
}
