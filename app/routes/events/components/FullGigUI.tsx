import { EventRowJson } from "~/data/models/EventRow";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { FullGigHeader } from "~/routes/events/components/FullGigHeader";
import {
  GetDistanceInfoButtonWithFetcher,
  SaveGigButton,
  UpdateGigButton
} from "~/routes/events/components/GigButtons";
import { GigPartUI } from "~/routes/events/components/GigPartUI";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";
import { useEventRouteFetchers } from "~/routes/events/useEventRouteFetchers";


export function FullGigUI(props: { row: EventRowJson }) {
  const gig = props.row.appGig;
  const fetchers = useEventRouteFetchers();
  const thisDistanceInfo = fetchers[EventsActionIntent.getDistanceInfo]
    .find(f => f.data?.id === props.row.id);
  const distanceInfo = thisDistanceInfo?.data.distanceInfo ?? gig.distanceInfo;

  const row = {
    ...props.row,
    appGig: {
      ...props.row.appGig,
      distanceInfo: thisDistanceInfo?.data.distanceInfo ?? props.row.appGig.distanceInfo
    }
  } satisfies EventRowJson;

  // hasUpdates is written in parsing.
  // when using fixtures, timeIsDifferent will calculate even if we forgot to mark the fixture.
  const timeIsDifferent = row.googleGig &&
    ((gig.startTime !== row.googleGig?.startDateTime)
      || (gig.endTime !== row.googleGig?.endDateTime));

  return (
    <div className="[&>*]:p-2">
      <FullGigHeader row={row} timeIsDifferent={timeIsDifferent} />

      <ul>
        {gig.parts.map(part => <GigPartUI key={part.type} part={part} />)}
      </ul>

      <div>
        {distanceInfo ? <DistanceInfo info={distanceInfo} /> : null}
      </div>

      <div className={"flex flex-col items-end"}>
        {!row.googleGig ? <SaveGigButton row={row} /> : null}
        {timeIsDifferent || row.hasUpdates ? <UpdateGigButton row={row} /> : null}
        {!gig.distanceInfo ? <GetDistanceInfoButtonWithFetcher row={row} /> : null}
      </div>
    </div>
  );
}
