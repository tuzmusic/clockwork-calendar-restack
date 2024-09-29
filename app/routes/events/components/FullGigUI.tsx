import dayjs from "dayjs";

import { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { GetDistanceInfoButton } from "~/routes/events/components/GetDistanceInfoButton";
import { GigPartUI } from "~/routes/events/components/GigPartUI";

export function FullGigUI({ gig }: { gig: FullCalendarGigJson }) {
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
          : <GetDistanceInfoButton gig={gig} />
      }
    </div>
  );
}
