import { EventRowJson } from "~/data/models/EventRow";
import { GigActionButton } from "~/routes/events/components/GigActionButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export const SaveGigButton = ({ row }: { row: EventRowJson }) =>
  <GigActionButton
    value={row.appGig}
    row={row}
    intent={EventsActionIntent.createEvent}
    idleText={"Save"}
    loadingText={"Saving"}
    testId={"SAVE_BUTTON"}
  />;


export const UpdateGigButton = ({ row }: { row: EventRowJson }) =>
  <GigActionButton
    value={row.appGig}
    row={row}
    intent={EventsActionIntent.updateEvent}
    idleText={"Update"}
    loadingText={"Updating"}
    testId={"UPDATE_BUTTON"}
  />;


export const GetDistanceInfoButton = ({ row }: { row: EventRowJson }) =>
  <GigActionButton
    value={row.appGig}
    row={row}
    intent={EventsActionIntent.getDistanceInfo}
    idleText={"Get distance info"}
    loadingText={"Getting distance info"}
    testId={"GET_DISTANCE_INFO_BUTTON"}
  />;

