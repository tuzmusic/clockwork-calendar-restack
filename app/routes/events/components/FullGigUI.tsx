import dayjs from "dayjs";

import FullCalendarGig from "~/data/models/FullCalendarGig";
import { Button } from "~/routes/events/components/Button";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { GigPartUI } from "~/routes/events/components/GigPartUI";
import { PATH as eventsPath } from "~/routes/events/route";

function GetDistanceInfoButton({ location }: { location: string }) {
  return (
    <form method="post" action={eventsPath}>
      <input name="location" type="hidden" value={location} />
      <Button data-testid="GET_DISTANCE_INFO_BUTTON">
        Get distance info
      </Button>
    </form>
  );
}

export function FullGigUI({ gig }: { gig: ReturnType<FullCalendarGig["serialize"]> }) {
  const date = dayjs(gig.parts[0].startDateTime).format("MMMM D, YYYY");

  return (
    <div className="[&>*]:p-2">
      <h3 className="flex justify-between border-b-2 align-middle">
        <span className="font-bold">{date}</span>
        <span>{gig.location}</span>
      </h3>

      <ul>
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>

      {
        gig.distanceInfo
          ? <DistanceInfo info={gig.distanceInfo} />
          : <GetDistanceInfoButton location={gig.location} />
      }
    </div>
  );
}
