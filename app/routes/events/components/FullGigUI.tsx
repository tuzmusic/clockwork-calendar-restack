import dayjs from "dayjs";
import React from "react";

import DayJsTz from "~/data/models/DayJsTz";
import { EventRowJson } from "~/data/models/EventRow";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { GetDistanceInfoButton } from "~/routes/events/components/GetDistanceInfoButton";
import { SaveGigButton } from "~/routes/events/components/GigButtons";
import { GigPartUI } from "~/routes/events/components/GigPartUI";

export function FullGigUI({ row }: { row: EventRowJson }) {
  const gig = row.appGig;
  const date = dayjs(gig.parts[0].startDateTime).format("MMMM D, YYYY");
  const [startTime, endTime] = [gig.startTime, gig.endTime].map(t => DayJsTz(t).format("h:mma"));

  const [venue, ...locationParts] = gig.location.split(",");
  const location = locationParts.join();

  const timeIsDifferent = (gig.startTime !== row.googleGig?.startDateTime)
    || (gig.endTime !== row.googleGig.endDateTime);

  return (
    <div className="[&>*]:p-2">
      <h3 className="flex justify-between border-b-2 align-middle">
        <div className="font-bold">
          <div>{date}</div>
          <div className={timeIsDifferent ? "text-red-700" : ""}>{startTime}-{endTime}</div>
        </div>
        <div className="text-right">
          <div>{venue}</div>
          <div>{location}</div>
        </div>
      </h3>


      <ul>
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>

      <div className={"flex justify-end gap-4"}>
        {!row.googleGig ? <SaveGigButton row={row} /> : null}
        {
          gig.distanceInfo
            ? <DistanceInfo info={gig.distanceInfo} />
            : <GetDistanceInfoButton gig={gig} />
        }
      </div>
    </div>
  );
}
