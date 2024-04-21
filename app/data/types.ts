import { Duration } from "dayjs/plugin/duration";

import { TIME_ZONE } from "~/data/constants";

export interface TimeObj {
  dateTime: string;
  timeZone: typeof TIME_ZONE;
}

export const timeObj = (str: string) => (
  {
    dateTime: str,
    timeZone: TIME_ZONE
  } satisfies TimeObj
);

type DistanceInMiles = number;

export interface DistanceData {
  duration: Duration
  distance: DistanceInMiles
}
