import dayjs from "dayjs";

import DayJsTz from "~/data/models/DayJsTz";
import { EventRowJson } from "~/data/models/EventRow";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { GetDistanceInfoButton, SaveGigButton, UpdateGigButton } from "~/routes/events/components/GigButtons";
import { GigPartUI } from "~/routes/events/components/GigPartUI";

export function FullGigUI({ row }: { row: EventRowJson }) {
  const gig = row.appGig;
  const date = dayjs(gig.parts[0].startDateTime).format("MMMM D, YYYY");
  const [startTime, endTime] = [gig.startTime, gig.endTime].map(t => DayJsTz(t).format("h:mma"));

  const [venue, ...locationParts] = gig.location.split(",");
  const location = locationParts.join();

  const timeIsDifferent = row.googleGig
    && ((gig.startTime !== row.googleGig?.startDateTime)
      || (gig.endTime !== row.googleGig?.endDateTime));

  return (
    <div className="[&>*]:p-2">
      <h3 className="flex justify-between border-b-2 align-middle">
        <div className="font-bold">
          <div>
            <span>{date}</span>
            {!row.googleGig ? <span className={"text-green-500"}>{" "}NEW</span> : null}
          </div>
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

      <div>
        {gig.distanceInfo ? <DistanceInfo info={gig.distanceInfo} /> : null}
      </div>

      <div className={"flex justify-end gap-4"}>
        {!row.googleGig ? <SaveGigButton row={row} /> : null}
        {/* hasUpdates is written in parsing.
            when using fixtures, timeIsDifferent will calculate even if we forgot to mark the fixture. */}
        {timeIsDifferent || row.hasUpdates ? <UpdateGigButton row={row} /> : null}
        {!gig.distanceInfo ? <GetDistanceInfoButton row={row} /> : null}
      </div>
    </div>
  );
}
