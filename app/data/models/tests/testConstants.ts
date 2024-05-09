import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { Reception } from "~/data/models/GigParts/Reception";
import { DistanceData, EventPart, timeObj } from "~/data/models/types";

export const location = "wherever";

export const start = "2024-12-01T19:00:00-04:00";

export const end = "2024-12-01T23:00:00-04:00";

export const mockDistanceData = {
  fromHome: { miles: 1, minutes: 10, formattedTime: "10m" },
  withWaltham: { miles: 2, minutes: 20, formattedTime: "20m" },
  walthamDetour: { miles: 3, minutes: 30, formattedTime: "30m" },
  fromWaltham: { miles: 4, minutes: 40, formattedTime: "40m" },
  fromBoston: { miles: 5, minutes: 50, formattedTime: "0mm" }
} satisfies Record<string, DistanceData>;

export const mockParts: EventPart[] = [
  {
    type: "reception",
    start: timeObj(start),
    end: timeObj(end)
  }
]
export const laterTime = "2024-12-01T19:00:00-04:00";
export const earlierTime = "2024-12-01T18:00:00-04:00";
export const finalTime = "2024-12-01T21:00:00-04:00";
export const receptionPart = new Reception(laterTime, finalTime);
export const cocktailHourPart = new CocktailHour(earlierTime, laterTime);
