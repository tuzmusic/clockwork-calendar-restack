import { EventRowJson } from "~/data/models/EventRow";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { FullGigHeader } from "~/routes/events/components/FullGigHeader";
import { GetDistanceInfoButton, SaveGigButton, UpdateGigButton } from "~/routes/events/components/GigButtons";
import { GigPartUI } from "~/routes/events/components/GigPartUI";


export function FullGigUI({ row }: { row: EventRowJson }) {
  const gig = row.appGig;

  const timeIsDifferent = row.googleGig
    && ((gig.startTime !== row.googleGig?.startDateTime)
      || (gig.endTime !== row.googleGig?.endDateTime));

  return (
    <div className="[&>*]:p-2">
      <FullGigHeader row={row} timeIsDifferent={timeIsDifferent}/>

      <ul>
        {gig.parts.map(part => <GigPartUI key={part.type} part={part} />)}
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
