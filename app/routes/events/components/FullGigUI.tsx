import { useSearchParams } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { FullDistanceInfoObj } from "~/data/models/FullCalendarGig";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { FullGigHeader } from "~/routes/events/components/FullGigHeader";
import {
  GetDistanceInfoButtonWithFetcher,
  SaveGigButton,
  UpdateGigButton
} from "~/routes/events/components/GigButtons";
import { GigPartUI } from "~/routes/events/components/GigPartUI";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";
import { useToggleParamValue } from "~/routes/events/filters/useEventFilters";
import { useEventRouteFetchers } from "~/routes/events/useEventRouteFetchers";


function addDistanceInfoToRow(row: EventRowJson, distanceInfo: FullDistanceInfoObj) {
  return { ...row, appGig: { ...row.appGig, distanceInfo } } satisfies EventRowJson;
}

function useFetchedDistanceInfo(row: EventRowJson) {
  const fetchers = useEventRouteFetchers();
  const thisDistanceInfo = fetchers[EventsActionIntent.getDistanceInfo]
    .find(f => f.data?.id === row.id);
  return thisDistanceInfo?.data.distanceInfo;
}

export function FullGigUI(props: { row: EventRowJson }) {
  const gig = props.row.appGig;
  const thisDistanceInfo = useFetchedDistanceInfo(props.row);
  const row = addDistanceInfoToRow(props.row, thisDistanceInfo ?? gig.distanceInfo);

  // hasUpdates is written in parsing.
  // when using fixtures, timeIsDifferent will calculate even if we forgot to mark the fixture.
  const timeIsDifferent = row.googleGig &&
    ((gig.startTime !== row.googleGig?.startDateTime)
      || (gig.endTime !== row.googleGig?.endDateTime));

  const toggleAlwaysShow = useToggleParamValue('alwaysShow')
  const [params] = useSearchParams();
  const alwaysShown = params.getAll('alwaysShow').includes(row.id)

  return (
    <div className="[&>*]:p-2">
      <FullGigHeader row={row} timeIsDifferent={timeIsDifferent} />

      <ul>
        {gig.parts.map(part => <GigPartUI key={part.type} part={part} />)}
      </ul>

      <div>
        {thisDistanceInfo ?? gig.distanceInfo ? <DistanceInfo info={thisDistanceInfo ?? gig.distanceInfo} /> : null}
      </div>

      <div className={'flex justify-between'}>
        <label className="flex gap-1">
          <input
            type="checkbox"
            checked={alwaysShown}
            onChange={() => toggleAlwaysShow(row.id)}
          />
          <span>Always Shown</span>
        </label>

        <div className={"flex flex-col items-end"}>
          {!row.googleGig ? <SaveGigButton row={row} /> : null}
          {timeIsDifferent || row.hasUpdates ? <UpdateGigButton row={row} /> : null}
          {!gig.distanceInfo ? <GetDistanceInfoButtonWithFetcher row={row} /> : null}
        </div>
      </div>
    </div>
  );
}
