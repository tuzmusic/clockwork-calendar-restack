import { Client } from "@googlemaps/google-maps-services-js";
import dayjs from "dayjs";

import { DistanceData } from "~/data/models/types";

export default class DistanceService {
  public async getDistanceInfo({ from, to, through }: {
    from: string
    to: string
    through?: string
  }): Promise<DistanceData> {
    const METERS_PER_MILE = 1608;

    // throw new Error('getDistanceInfo not implemented')


    /** https://developers.google.com/maps/documentation/directions/get-directions */

    const mapsClient = new Client({});
    const response = await mapsClient.directions({
      params: {
        key: process.env.GOOGLE_API_KEY!,
        origin: from,
        destination: to,
        waypoints: through ? [through] : []
      }
    });
    const { legs } = response.data.routes[0];

    const duration = dayjs.duration(
      // duration.text is human-readable, but we're doing math on it so we can't use it
      // note: this might be in seconds? or 1000 seconds???
      //  if we're just using "minutes" below then we probably want to get rid of "* 1000"
      legs.reduce((acc, leg) => acc + leg.duration.value * 1000, 0)
    );

    const distance = legs.reduce((acc, leg) => acc + leg.distance.value / METERS_PER_MILE, 0);

    return {
      miles: distance,
      minutes: duration.minutes(),
      formattedTime: duration.format("H[h]m[m]")
    };
  }
}
